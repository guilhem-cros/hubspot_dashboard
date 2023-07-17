export default interface Contact {
    id: number;
    lifecycleStage: string;
    properties: {
        firstname: string | null;
        lastname: string | null;
        email: string | null;
        closedate: Date | null;
        createddate: Date;
        leaddate: Date | null;
        subscriberDate: Date | null;
    };
}

function getConvertionTime(contact: Contact): [number | null, number | null] {
    if (contact.lifecycleStage.localeCompare('customer') === 0) {
        const leadDate = contact.properties.leaddate;
        const closeDate = contact.properties.closedate;
        const createDate = contact.properties.createddate;
        const subscriberDate = contact.properties.subscriberDate;

        const startDate = leadDate || createDate;

        if (closeDate && startDate) {
            const startTime = new Date(startDate).getTime();
            const endTime = new Date(closeDate).getTime();
            const timeDiff = endTime - startTime;
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

            let subscriberToCloseDaysDiff = null;
            if (subscriberDate) {
                const subscriberTime = new Date(subscriberDate).getTime();
                const subscriberToCloseTimeDiff = endTime - subscriberTime;
                subscriberToCloseDaysDiff = Math.ceil(subscriberToCloseTimeDiff / (1000 * 60 * 60 * 24));
            }

            return [daysDiff, subscriberToCloseDaysDiff];
        }
    }

    return [null, null];
}

export function getAvgConvertionTime(contacts: Contact[]): [number | null, number | null] {
    const validContacts = contacts.filter((contact) => contact.lifecycleStage.localeCompare('customer') === 0);
    const conversionTimes = validContacts.map((contact) => getConvertionTime(contact));
    const filteredConversionTimes = conversionTimes.filter((times) => times[0] !== null) as [number, number][];

    if (filteredConversionTimes.length > 0) {
        const totalDays = filteredConversionTimes.reduce((acc, [days, subscriberToCloseDays]) => acc + days, 0);
        const totalSubscriberToCloseDays = filteredConversionTimes.reduce(
            (acc, [days, subscriberToCloseDays]) => acc + (subscriberToCloseDays !== null ? subscriberToCloseDays : 0),
            0
        );
        const averageDays = totalDays / filteredConversionTimes.length;
        const averageSubscriberToCloseDays =
            totalSubscriberToCloseDays !== 0 ? totalSubscriberToCloseDays / filteredConversionTimes.length : null;

        return [averageDays, averageSubscriberToCloseDays];
    }

    return [null, null];
}
