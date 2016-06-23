import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { EventChats } from '../eventChats.js';

Meteor.publish('eventChats.ofEvent', function eventChatsOfEvent(eventId) {
  new SimpleSchema({
    eventId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validate({ eventId });

  if (!this.userId) {
    return this.ready();
  }

  return EventChats.find({ eventId }, {
    sort: { dateCreated: 1 }
  }, {
    fields: EventChats.publicFields,
  });
});
