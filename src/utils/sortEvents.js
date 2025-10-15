
function customEventComparator(eventA, eventB) {
  const dateA = new Date(eventA.date_time);
  const dateB = new Date(eventB.date_time);
  
  if (dateA < dateB) return -1;
  if (dateA > dateB) return 1;
  const locationA = eventA.location.toLowerCase();
  const locationB = eventB.location.toLowerCase();
  
  if (locationA < locationB) return -1;
  if (locationA > locationB) return 1;
  
  return 0; // Both date and location are equal
}

function sortEvents(events) {
  const eventsCopy = [...events];
  return eventsCopy.sort(customEventComparator);
}


function getUpcomingEventsSorted(events) {
  const now = new Date();
  
  const upcomingEvents = events.filter(event => {
    const eventDate = new Date(event.date_time);
    return eventDate > now;
  });
  
  return sortEvents(upcomingEvents);
}

module.exports = {
  customEventComparator,
  sortEvents,
  getUpcomingEventsSorted,
};