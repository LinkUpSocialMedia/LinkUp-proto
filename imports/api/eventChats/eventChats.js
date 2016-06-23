import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const EventChats = new Mongo.Collection('eventChats');

EventChats.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

EventChats.schema = new SimpleSchema({
  userId: { type: String, regEx: SimpleSchema.RegEx.Id },
  eventId: { type: String, regEx: SimpleSchema.RegEx.Id },
  name: { type: String },
  avatar: { type: String, regEx: SimpleSchema.RegEx.Url },
  message: { type: String },
  dateCreated: { type: Date },
});

EventChats.attachSchema(EventChats.schema);

EventChats.publicFields = {
  eventId: 1,
  name: 1,
  message: 1,
  dateCreated: 1,
  avatar: 1,
  userId: 1,
};
