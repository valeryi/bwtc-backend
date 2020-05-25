import mongoose, { Schema } from "mongoose";

export interface IActivity {
    activity: string,
    client_id: string,
    date: Date,
}

const activitySchema: Schema = new mongoose.Schema({

    activity: {
        type: String,
        required: true,
        trim: true
    },
    client_id: {
        type: Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true,
        trim: true
    },

}, {
    timestamps: true,
});

export const ActivityModel = mongoose.model('Activity', activitySchema, 'activity');