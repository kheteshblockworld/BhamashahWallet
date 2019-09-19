/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 20, 2018
 * @Description: Common File For Transcation Type.
 */ 
module.exports.TRANSACTION_TYPE_CREDIT = '1';
module.exports.TRANSACTION_TYPE_DEBIT = '0';
module.exports.TRANSACTION_TYPE_NONE = '-1';
//'load','loadreversal','Spend','SpendReversal','FundTransfer','IMPSTransfer'
module.exports.TYPE_LOAD = 'load';
module.exports.TYPE_LOADREVERSAL = 'loadreversal';
module.exports.TYPE_SPEND = 'Spend';
module.exports.TYPE_SPENDREVERSAL = 'SpendReversal';
module.exports.TYPE_FUNDTRANSFER = 'FundTransfer';
module.exports.TYPE_IMPSTRANSFER = 'IMPSTransfer';
module.exports.TYPE_BILLPAYMENT = 'BillPayment';

//'PENDING','PROCESSING','COMPLETE','FAILED','CANCELED', 'READ'
module.exports.STATUS_PENDING = 'PENDING';
module.exports.STATUS_PROCESSING = 'PROCESSING';
module.exports.STATUS_COMPLETE = 'COMPLETE';
module.exports.STATUS_SUCCESS = 'SUCCESS'; 
module.exports.STATUS_FAILED = 'FAILED';
module.exports.STATUS_CANCELED = 'CANCELED';
module.exports.STATUS_READ = 'READ';
module.exports.STATUS_CREATE = 'CREATE';
module.exports.STATUS_DELETE = 'DELETE';
module.exports.STATUS_WRITE = 'WRITE';

module.exports.SHOW_USER_YES = 1;
module.exports.SHOW_USER_NO = 0;
//bank payee management
 // account_type 'mobile','bank','VPA'
 module.exports.ACCOUNT_TYPE_MOBILE = 'mobile';
 module.exports.ACCOUNT_TYPE_BANK = 'bank';
 module.exports.ACCOUNT_TYPE_VPA = 'VPA';

 //status : Beneficiary Status
 module.exports.STATUS_ACTIVE = "ACTIVE";
 module.exports.STATUS_INACTIVE = "INACTIVE";
 module.exports.STATUS_DELETED = "DELETED";
 module.exports.STATUS_NOTVERIFIED = "NOTVERIFIED";
 module.exports.STATUS_VERIFIED = "VERIFIED";
 module.exports.STATUS_MODIFIED = "MODIFIED"

 module.exports.ACCOUNT_VERIFIED = '1';
 module.exports.ACCOUNT_NOTVERIFIED = '0';

 module.exports.STATUS_CLOSED = "CLOSED";
 //staus : Request Money
 module.exports.REQUEST_STATUS_PENDING = 0;
 module.exports.REQUEST_STATUS_PAID = 1;

 module.exports.REQUEST_STATUS_ACTIVE = 1;
 module.exports.REQUEST_STATUS_DELETED = 0;
