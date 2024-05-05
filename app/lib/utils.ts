export const formatDateTime = (
    date: Date
) => {
    const formatter = new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
    return formatter.format(date);

}