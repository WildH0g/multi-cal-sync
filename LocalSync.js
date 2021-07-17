// jshint esversion: 9
// jshint laxbreak: false

const LocalCal = (function () {
  const _template = {
    eventId: {
      description: '',
      start: '',
      end: '',
      isAllDay: false,
      isRecurring: true,
      invitees: [],
      syncDate: '',
      calendarId: '',
      status: '',
    },
  };

  function _getRelativeDate(daysOffset, hour) {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    date.setHours(hour);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  class LocalCal {
    constructor() {}

    /**
     * Retrieve and log events from the given calendar that have been modified
     * since the last sync. If the sync token is missing or invalid, log all
     * events from up to a month ago (a full sync).
     *
     * @param {string} calendarId The ID of the calender to retrieve events from.
     * @param {boolean} fullSync If true, throw out any existing sync token and
     *        perform a full sync; if false, use the existing sync token if possible.
     */
    static sync(calendarId, fullSync) {
      const properties = PropertiesService.getUserProperties();
      const options = {
        maxResults: 100,
      };

      const syncToken = properties.getProperty('syncToken');
      if (syncToken && !fullSync) {
        options.syncToken = syncToken;
      } else {
        // Sync events up to thirty days in the past.
        options.timeMin = _getRelativeDate(0, 0).toISOString();
        options.timeMax = _getRelativeDate(30, 0).toISOString();
      }

      // Retrieve events one page at a time.
      let events;
      let pageToken;
      const eventsObj = {};
      do {
        try {
          options.pageToken = pageToken;
          events = Calendar.Events.list(calendarId, options);
        } catch (e) {
          // Check to see if the sync token was invalidated by the server;
          // if so, perform a full sync instead.
          if (
            e.message ===
            'Sync token is no longer valid, a full sync is required.'
          ) {
            properties.deleteProperty('syncToken');
            LocalCal.sync(calendarId, true);
            return;
          } else {
            throw new Error(e.message);
          }
        }

        if (events.items && events.items.length > 0) {
          for (let i = 0; i < events.items.length; i++) {
            const event = events.items[i];

            // const {
            //   id,
            //   iCalUID,
            //   status,
            //   created,
            //   updated,
            //   summary,
            //   description,
            //   creator,
            //   organizer,
            //   start,
            //   end,
            //   recurrence,
            //   recurringEventId,
            //   originalStartTime,
            //   attendees
            // } = event;

            // const eventObj = {
            //   id,
            //   iCalUID,
            //   status,
            //   created,
            //   updated,
            //   summary,
            //   description,
            //   creator,
            //   organizer,
            //   start,
            //   end,
            //   recurrence,
            //   recurringEventId,
            //   originalStartTime,
            //   attendees,
            //   syncDateTime: Date.now()
            // };
            const eventObj = {
              ...Utils.clone(event),
              syncDateTime: Date.now()
            };

            eventsObj[eventObj.id] = eventObj;
          }
        } else {
          console.log('No events found.');
        }

        pageToken = events.nextPageToken;
      } while (pageToken);

      properties.setProperty('syncToken', events.nextSyncToken);

      return eventsObj;
    }

    static removeToken() {
      PropertiesService.getUserProperties().deleteProperty('syncToken');
      return this;
    }
  }

  return LocalCal;
})();
