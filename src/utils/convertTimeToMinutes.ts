export const convertTimeToMinutes = (value: string) => {
    const [hours, minutes] = value.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes
}