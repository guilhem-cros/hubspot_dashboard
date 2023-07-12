export default interface Contact{
    id: number,
    lifecycleStage: string,
    properties: {
        firstname: string|null,
        lasname: string|null,
        email: string|null,
        closedate : Date|null,
        createddate: Date,
        leaddate: Date|null
    }
}

function getConvertionTime(contact: Contact): number|null{
    if(contact.lifecycleStage.localeCompare("customer")===0){
        const leadDate = contact.properties.leaddate;
        const closeDate = contact.properties.closedate;
        const createDate = contact.properties.createddate;

        const startDate = leadDate || createDate;

        if (closeDate && startDate) {
            const startTime = new Date(startDate).getTime();
            const endTime = new Date(closeDate).getTime();
            const timeDiff = endTime - startTime;
            const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

            return daysDiff;
        }
    }

    return null;
}

export function getAvgConvertionTime(contacts : Contact[]): number|null{
    const validContacts = contacts.filter(contact => contact.lifecycleStage.localeCompare("customer") === 0);
    const conversionTimes = validContacts.map(contact => getConvertionTime(contact));
    const filteredConversionTimes = conversionTimes.filter(time => time !== null) as number[];

    if (filteredConversionTimes.length > 0) {
        const sum = filteredConversionTimes.reduce((a, b) => a + b);
        const average = sum / filteredConversionTimes.length;
        return average;
    }

    return null; // Return null if no valid conversion times are available
}