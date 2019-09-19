/**
 * @author: Sathiyan Baskaran
 * @version: 1.0.0
 * @date: October 16, 2018
 * @Description: Common File For Transcation Status.
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

//'PENDING','PROCESSING','COMPLETE','FAILED','CANCELED'
module.exports.STATUS_PENDING = 'PENDING';
module.exports.STATUS_PROCESSING = 'PROCESSING';
module.exports.STATUS_COMPLETE = 'COMPLETE';
module.exports.STATUS_FAILED = 'FAILED';
module.exports.STATUS_CANCELED = 'CANCELED';

module.exports.SHOW_USER_YES = 1;
module.exports.SHOW_USER_NO = 0;