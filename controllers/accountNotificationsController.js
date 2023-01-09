import AccountNotification from '../models/accountNotification.js';

const createNotification = async (
  forUserId,
  fromUserId,
  contentType,
  contentId
) => {
  try {
    const newNotification = {
      forUser: forUserId,
      fromUser: fromUserId,
      contentType: contentType,
      contentId: contentId
    };

    const createdNotification = await AccountNotification.create(
      newNotification
    );

    if (createdNotification) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
  }
};

const getNotificationsForUser = async (req, res, next, userId) => {
  try {
  } catch (error) {
    console.error(error);
  }
};

const deleteNotification = async (req, res, next) => {};

export default {
  createNotification,
  getNotificationsForUser,
  deleteNotification
};
