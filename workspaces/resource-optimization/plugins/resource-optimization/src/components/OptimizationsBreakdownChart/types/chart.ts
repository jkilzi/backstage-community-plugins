export const enum UsageType {
    cpuUsage = 'cpuUsage',
    memoryUsage = 'memoryUsage',
}


// eslint-disable-next-line no-shadow
export const enum Interval {
    shortTerm = 'shortTerm', // last 24 hrs
    mediumTerm = 'mediumTerm', // last 7 days
    longTerm = 'longTerm', // last 15 days
}