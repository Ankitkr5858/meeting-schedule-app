export const convertMinutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMins = mins < 10 ? '0' + mins : mins;
    return `${formattedHours}:${formattedMins} ${ampm}`;
}