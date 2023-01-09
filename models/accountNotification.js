import mongoose from 'mongoose';

const accountNotificationSchema = new mongoose.Schema(
  {
    forUser: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    fromUser: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    contentType: { type: String, required: true },
    contentId: { type: mongoose.Schema.ObjectId, refPath: 'contentType', required: true }
  },
  { timestamps: true }
);

export default mongoose.model('accountNotification', accountNotificationSchema);
