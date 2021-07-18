// jshint esversion: 9
// jshint laxbreak: true

const main = () => {
  const e = LocalCal.sync(CalendarApp.getDefaultCalendar().getId());

  MCSFile.write({
    ...e,
  });
};

const removeKey = () => {
  LocalCal.removeToken();
};

const addEvent = () => {
  const rc = new RemoteCal();
  rc.addEvent();
};

const deleteEvent = () => {
  const rc = new RemoteCal();
  rc.deleteEvent('4716lvss714vg3f8chb13ltn74');
};

const updateEvent = () => {
  const rc = new RemoteCal();
  rc.updateEvent('asln4tbl62drc9b7mjvm4m5bio');
};

const shareFile = () => {
  MCSFile.share();
};
