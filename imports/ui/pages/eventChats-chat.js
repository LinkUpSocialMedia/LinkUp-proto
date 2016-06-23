import './eventChats-chat.html';

import { Meteor } from 'meteor/meteor';
import { EventChats } from '../../api/eventChats/eventChats.js';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tracker } from 'meteor/tracker';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { _ } from 'meteor/underscore';
import { ReactiveDict } from 'meteor/reactive-dict';

import '../../api/eventChats/methods.js';
import '../components/chat-message.js';

Template.EventChats_chat.onCreated(function() {
  this.autorun(() => {
    id = FlowRouter.getParam('_id');
    this.subscribe('eventChats.ofEvent', id);
    this.subscribe('users.current');
  });
  if (Meteor.isCordova) {
    Keyboard.shrinkView(true);
    window.addEventListener('keyboardDidShow', () => {
      const objDiv = document.getElementById("scrolling-content-container");
      objDiv.scrollTop = objDiv.scrollHeight;
    });
  }
});

Template.EventChats_chat.onRendered(function() {
  this.autorun(() => {
    EventChats.find().observe({
      added: function(doc) {
        Tracker.afterFlush(() => {
          const objDiv = document.getElementById("scrolling-content-container");
          objDiv.scrollTop = objDiv.scrollHeight;
        });
      }
    });
  });
});

Template.EventChats_chat.helpers({
  messages() {
    const eventId = FlowRouter.getParam('_id');
    return EventChats.find({ eventId });
  },
  eventName() {
    const userEvents = Meteor.users.findOne().events;
    const event = _.find(userEvents, (obj) => {
      return obj.eventId === FlowRouter.getParam('_id');
    });
    return event.name;
  },
});

Template.EventChats_chat.events({
  'submit #send-message'(event) {
    event.preventDefault();

    user = Meteor.users.findOne(Meteor.userId());

    const message = {
      eventId: FlowRouter.getParam('_id'),
      message: event.target.message.value,
      name: user.name,
      avatar: user.avatar,
    };

    Meteor.call('eventChats.insert', message);

    Tracker.afterFlush(() => {
      const objDiv = document.getElementById("scrolling-content-container");
      objDiv.scrollTop = objDiv.scrollHeight;
    });

    event.target.message.value = '';
  },
  // 'keydown #message-message'(event) {
  //   if (event.which === 13) {
  //     user = Meteor.users.findOne(Meteor.userId());
  //
  //     const message = {
  //       eventId: FlowRouter.getParam('_id'),
  //       message: event.target.value,
  //       name: user.name,
  //       avatar: user.avatar,
  //     };
  //
  //     Meteor.call('eventChats.insert', message);
  //
  //     Tracker.afterFlush(() => {
  //       const objDiv = document.getElementById("scrolling-content-container");
  //       objDiv.scrollTop = objDiv.scrollHeight;
  //     });
  //
  //     event.target.value = '';
  //   }
  // },
  // 'keyup #message-message'(event) {
  //   if (event.which === 13) {
  //     event.target.value = '';
  //   }
  // },
});
