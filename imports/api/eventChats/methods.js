import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { EventChats } from './eventChats.js';

export const insert = new ValidatedMethod({
  name: 'eventChats.insert',
  validate: new SimpleSchema({
    eventId: { type: String, regEx: SimpleSchema.RegEx.Id },
    message: { type: String },
    name: { type: String },
    avatar: { type: String, regEx: SimpleSchema.RegEx.Url },
  }).validator(),
  run({ eventId, message, name, avatar }) {
    if (!this.userId) {
      throw new Meteor.Error('eventChats.insert.accessDenied',
        'You must be logged in to send a message!');
    }

    const chat = {
      userId: this.userId,
      eventId,
      name,
      avatar,
      message,
      dateCreated: new Date(),
    };

    EventChats.insert(chat);
  },
});
