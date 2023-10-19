

export interface IWireCard {
    id: number;
    user_id: number;
    payment_type: string; // ORDER || E-WALLET
    transaction_id: string;
    request_id: string;
    transaction_type: string;
    transaction_state: string;
    completion_timestamp: string;
    status_code: string;
    status_description: string;
    status_severity: string;
    request_amount_currency: string;
    request_amount_value: string;
    group_transaction_id: string;
    first_name: string;
    last_name: string;
    wc_expire_month: string;
    wc_expire_year: string;
    wc_type: string;
    wc_token_id: string;
    wc_number: string;
    ip_address: string;
    description: string;
    payment_method: string;
    api_id: string; 
    instrument_country: string;
    provider_account_id: string;
    created_at?: Date;
};

export interface IPaylah {
}
