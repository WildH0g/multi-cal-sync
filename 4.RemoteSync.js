// jshint esversion: 9
// jshint laxbreak: true
const RemoteCal = (function () {
  const _dummyEvent = {
    id: '6nenue2mpdedudv87qsk6vg223',
    created: '2021-07-18T13:23:00.000Z',
    status: 'confirmed',
    updated: '2021-07-18T13:28:30.452Z',
    eventType: 'default',
    sequence: 2,
    reminders: { useDefault: true },
    organizer: { email: 'dmitry.kostyuk@gmail.com', self: true },
    creator: { email: 'dmitry.kostyuk@gmail.com', self: true },
    start: { dateTime: '2021-07-18T21:00:00+02:00' },
    iCalUID: '6nenue2mpdedudv87qsk6vg223@google.com',
    end: { dateTime: '2021-07-18T21:15:00+02:00' },
    kind: 'calendar#event',
    etag: '"3253229820904000"',
    summary: 'DUMMY EVENT 2',
    htmlLink:
      'https://www.google.com/calendar/event?eid=Nm5lbnVlMm1wZGVkdWR2ODdxc2s2dmcyMjMgZG1pdHJ5Lmtvc3R5dWtAbQ',
    lastSync: 1626614920161,
  };

  class RemoteCal {
    constructor() {}

    addEvent() {
      const calendarId = 'primary';
      const eventObj = Utils.clone(_dummyEvent);

      const propsToRemove = [
        'id',
        'created',
        'updated',
        'iCalUID',
        'etag',
        'lastSync',
      ];

      propsToRemove.forEach(prop => {
        if (eventObj[prop]) delete eventObj[prop];
      });

      eventObj.summary = '[MSC Synced] ' + eventObj.summary;

      const newEvent = Calendar.Events.insert(eventObj, calendarId);
      Logger.log('Event ID: ' + newEvent.id);
      return this;
    }

    deleteEvent(id) {
      Calendar.Events.remove('primary', id);
      return this;
    }

    updateEvent(id, data) {
      const eventObj = Utils.clone(_dummyEvent);

      const propsToRemove = [
        'id',
        'created',
        'updated',
        'iCalUID',
        'etag',
        'lastSync',
      ];

      propsToRemove.forEach(prop => {
        if (eventObj[prop]) delete eventObj[prop];
      });

      eventObj.end.dateTime = '2021-07-18T22:45:00+02:00';
      eventObj.summary = '[MSC Synced] ' + eventObj.summary;

      const event = Calendar.Events.update(eventObj, 'primary', id);
    }
  }

  return RemoteCal;
})();
