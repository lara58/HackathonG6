import axiosClient from '../utils/axiosClient';

export const createTweet = async (content, media) => {
    const formData = new FormData();
    formData.append('content', content);
    if (media) formData.append('media', media);

    const response = await axiosClient.post('/tweets', formData, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getAllTweets = async () => {
    const response = await axiosClient.get('/tweets');
    return response.data;
};

export const getFeed = async () => {
    const response = await axiosClient.get(`/tweets/feed`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
};

export const getTrending = async () => {
    const response = await axiosClient.get(`/tweets/trending`);
    return response.data;
};

export const getTweetById = async (id) => {
    const response = await axiosClient.get(`/tweets/${id}`);
    return response.data;
};

export const likeTweet = async (id) => {
    const response = await axiosClient.post(`/tweets/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
};

export const retweetTweet = async (id) => {
    const response = await axiosClient.post(`/tweets/${id}/retweet`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
};

export const deleteTweet = async (id) => {
    const response = await axiosClient.delete(`/tweets/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    return response.data;
};
