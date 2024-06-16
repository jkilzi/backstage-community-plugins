//

// ******************************************************************
// * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY. *
// ******************************************************************



export interface IngressReportOutAllOf {


    'uuid'?: string;
    'sourceUuid'?: string;
    'reportsList'?: Array<string>;
    /**
    * Billing year for files.
    */
    'billYear'?: string;
    /**
    * Billing month for files.
    */
    'billingMonth'?: string;
    /**
    * Timestamp of posted reports.
    */
    'createdTimestamp'?: any | null;
    /**
    * Timestamp of successfully processed reports.
    */
    'completedTimestamp'?: any | null;
}

