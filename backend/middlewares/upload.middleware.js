const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const mongoose = require('mongoose');

// Créer le dossier uploads s'il n'existe pas
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuration du stockage local d'abord, puis transfert vers GridFS
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Génère un nom de fichier unique avec crypto
    crypto.randomBytes(16, (err, buf) => {
      if (err) return cb(err);
      
      const uniqueFilename = buf.toString('hex') + path.extname(file.originalname);
      cb(null, uniqueFilename);
    });
  }
});

// Filtrer les types de fichiers autorisés
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    // Images
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    // Vidéos
    'video/mp4', 'video/webm', 'video/quicktime',
    // Documents
    'application/pdf'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Type de fichier non pris en charge. Types acceptés: ${allowedTypes.join(', ')}`), false);
  }
};

// Configuration de multer pour le stockage local temporaire
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limite
  },
  fileFilter: fileFilter
});

/**
 * Gestion GridFS simplifiée en utilisant mongoose directement
 */

// Fonction pour déplacer un fichier local vers GridFS
const moveToGridFS = async (filePath, originalname, mimetype, userId) => {
  try {
    const conn = mongoose.connection;
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });
    
    // Créer un stream de lecture du fichier local
    const readStream = fs.createReadStream(filePath);
    
    // Créer un stream d'écriture vers GridFS
    const uploadStream = bucket.openUploadStream(path.basename(filePath), {
      metadata: {
        originalname: originalname,
        mimetype: mimetype,
        uploadedBy: userId || 'anonymous'
      }
    });
    
    // Pipe pour copier le fichier local vers GridFS
    return new Promise((resolve, reject) => {
      readStream
        .pipe(uploadStream)
        .on('error', (error) => {
          reject(error);
        })
        .on('finish', () => {
          // Une fois le fichier transféré, supprimer le fichier local
          fs.unlink(filePath, (err) => {
            if (err) console.error('Erreur lors de la suppression du fichier local:', err);
          });
          
          resolve({
            id: uploadStream.id.toString(),
            filename: uploadStream.filename
          });
        });
    });
  } catch (error) {
    console.error('Erreur lors du transfert vers GridFS:', error);
    throw error;
  }
};

// Middleware pour gérer l'upload d'un seul fichier
const uploadSingle = (fieldName) => {
  return [
    // 1. Utiliser multer pour stocker temporairement le fichier
    upload.single(fieldName),
    
    // 2. Transférer le fichier vers GridFS
    async (req, res, next) => {
      try {
        if (!req.file) {
          return next(); // Pas de fichier, continuer
        }
        
        const { path: filePath, originalname, mimetype } = req.file;
        const userId = req.user ? req.user.id : null;
        
        // Déplacer le fichier de local vers GridFS
        const gridFSFile = await moveToGridFS(filePath, originalname, mimetype, userId);
        
        // Mettre à jour req.file avec les informations GridFS
        req.file.gridFS = gridFSFile;
        req.file.path = `/api/files/${gridFSFile.id}`; // URL pour accéder au fichier
        
        next();
      } catch (error) {
        next(error);
      }
    }
  ];
};

// Middleware pour gérer l'upload de plusieurs fichiers
const uploadMultiple = (fieldName, maxCount) => {
  return [
    // 1. Utiliser multer pour stocker temporairement les fichiers
    upload.array(fieldName, maxCount),
    
    // 2. Transférer les fichiers vers GridFS
    async (req, res, next) => {
      try {
        if (!req.files || req.files.length === 0) {
          return next(); // Pas de fichiers, continuer
        }
        
        const userId = req.user ? req.user.id : null;
        
        // Traiter chaque fichier
        const gridFSPromises = req.files.map(async (file) => {
          const { path: filePath, originalname, mimetype } = file;
          const gridFSFile = await moveToGridFS(filePath, originalname, mimetype, userId);
          
          // Mettre à jour le fichier avec les informations GridFS
          file.gridFS = gridFSFile;
          file.path = `/api/files/${gridFSFile.id}`;
          
          return file;
        });
        
        // Attendre que tous les fichiers soient traités
        req.files = await Promise.all(gridFSPromises);
        
        next();
      } catch (error) {
        next(error);
      }
    }
  ];
};

// Middleware pour servir un fichier depuis GridFS
const serveFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    
    const conn = mongoose.connection;
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });
    
    // Chercher le fichier par son ID
    const _id = new mongoose.Types.ObjectId(fileId);
    const cursor = bucket.find({ _id });
    const files = await cursor.toArray();
    
    if (!files || files.length === 0) {
      return res.status(404).json({ message: 'Fichier non trouvé' });
    }
    
    const file = files[0];
    
    // Définir les en-têtes de réponse
    res.set('Content-Type', file.metadata.mimetype);
    res.set('Content-Disposition', `inline; filename="${file.metadata.originalname}"`);
    
    // Créer un stream de lecture depuis GridFS vers la réponse HTTP
    bucket.openDownloadStream(_id).pipe(res);
  } catch (error) {
    console.error('Erreur lors de la récupération du fichier:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération du fichier' });
  }
};

// Fonction pour supprimer un fichier de GridFS
const deleteFileById = async (fileId) => {
  try {
    const conn = mongoose.connection;
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, {
      bucketName: 'uploads'
    });
    
    await bucket.delete(new mongoose.Types.ObjectId(fileId));
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la suppression du fichier:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  upload,
  uploadSingle,
  uploadMultiple,
  serveFile,
  deleteFileById
};
