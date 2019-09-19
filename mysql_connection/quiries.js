//profile
module.exports.updateuser = ' update users SET sso_id = ? WHERE id = ?'
module.exports.newuser = 'insert into users (sso_id,name,sso_mobile,email,bhamashah_id,bhamashah_mid,adhar_id,dob,gender,address,language,status,date_created)VALUES ?'
module.exports.readuser = 'select * from users where id = ?'
module.exports.deleteuser = 'delete from users where id = ?'
module.exports.testuser = 'insert into userdata (name,age) VALUES ?'
module.exports.delete = 'delete from userdata where name = ?'
module.exports.read = 'select * from users where name = ?'
module.exports.getBckeyForUser = 'select blockchain_key from users where id = ?'


//getting transaction count for every transaction (daily,weekly,monthly)
module.exports.getTable='SELECT Date,Count FROM TransactionCountDayWeekMonth'
module.exports.getcontentFromTFC = 'select Date from TransactionCountDayWeekMonth where Date=?'
module.exports.addSuccessCountForTx = 'insert into TransactionCountDayWeekMonth (Date,Count) VALUES ?'
module.exports.updateCountForTx = 'UPDATE TransactionCountDayWeekMonth SET Count = Count + 1 where Date=?'

//aadharkyc
module.exports.readaadharkyc = 'select * from access_token where access_token = ?'
module.exports.getWalletBYID= 'select * from wallet where user_id = ?'
module.exports.updatewalletaadhar = 'update wallet SET aadhaar_id = ?  WHERE user_id = ?'
module.exports.updatestatus = 'update wallet SET kyc_status = ?  WHERE user_id = ?'
module.exports.updateuserdata = 'update users SET dob = ?,gender = ?,address = ? WHERE id = ?'
module.exports.updatewalletstatusactive = 'update wallet SET kyc_status = ?,status = ? WHERE user_id = ?'



//closewallet
module.exports.readusersid = 'select * from users where id = ?'
module.exports.updatewalletstatus = 'update wallet SET wallet_balance = ?,status = ?,date_last_edit = ?  WHERE user_id = ?'
module.exports.updateuserstatus = 'update users SET status = ?,date_last_edit = ?  WHERE id = ?'
module.exports.updatewstatus='update wallet SET status = ?,date_last_edit = ?  WHERE user_id = ?'
module.exports.feedbackstatus='insert into feedback (user_id,message,date_created) VALUES ?'

//Login
module.exports.insertuser = 'insert into users (sso_id,blockchain_key,name,sso_mobile,email,bhamashah_id,bhamashah_mid,adhar_id,dob,gender,address,language,status,date_created,date_last_edit) VALUES ?'
module.exports.getSSOuser = 'select * from users where status IN ("ACTIVE","NONACTIVE") AND sso_id = ?'
module.exports.updateuserdate = 'update users set date_last_edit= ? where SSO_ID = ?'


//  MPIN
module.exports.deletedeviceid = 'delete from mpin where device_id = ?'
module.exports.finddeviceid = 'select * from mpin where device_id = ?'
module.exports.finduserbyusermpin = 'select * from mpin where user_id = ?'
module.exports.creatempin = 'insert into mpin (user_id,device_id,mpin,one_signal_id,date_last_edit) VALUES ?'
module.exports.finduserbywallet = 'SELECT * FROM wallet where kyc_status IN ("AADHAAR_KYC","FULL_KYC") AND user_id = ?'
module.exports.finduserbyuser = 'select * from users where id = ?'
module.exports.updatempin = 'update mpin set device_id= ?,mpin=?,one_signal_id=?,date_last_edit=? where user_id = ?'
module.exports.updateonesignalid = 'update mpin set one_signal_id =? where device_id = ?'
module.exports.updatenewmpin = 'update mpin set mpin = ? where user_id = ?'


// Forgot MPIN
module.exports.findmobilebywallet = 'SELECT * FROM wallet where kyc_status IN ("AADHAAR_KYC","FULL_KYC") AND wallet_mobile = ?'
module.exports.finduser = 'select * from users where id = ? AND status IN ("ACTIVE")'
module.exports.findusermobile = 'select * from users where sso_mobile = ? AND status IN ("ACTIVE")'

// OTP
module.exports.findOTP = 'select * from otp where user_id = ?'
module.exports.deleteuser = 'delete from otp where user_id = ?'
module.exports.otpcheck = 'select * from otp where otp =? AND otp_reference =?'
module.exports.addotp = 'insert into otp (user_id,otp,otp_reference,date_created) VALUES ?'

// AccessToken
module.exports.updateaccesstoken_access_token = 'update access_token set device_id=?,access_token=?,date_last_edit=? where user_id = ?'
module.exports.insertaccesstoken_access_token = 'insert into access_token (user_id,device_id,access_token,date_last_edit) VALUES ?'
module.exports.deletedeviceid_access_token = 'delete from access_token where device_id = ?'
module.exports.finduser_access_token = 'select * from access_token where user_id = ?'
module.exports.findaccess_token_user = 'select * from access_token where access_token = ?'
module.exports.findaccesstoken_access_token = 'select * from access_token where access_token = ?'
module.exports.find_Access_Token_By_ID = 'select * from access_token where access_token = ?'

//
module.exports.getValidWallet = 'SELECT * FROM wallet where kyc_status IN ("AADHAAR_KYC","FULL_KYC") AND wallet_mobile = ?'
module.exports.getValidBeneficiary = 'SELECT * FROM beneficiary where  user_id=? AND type=? AND account_no=? AND ifsc_code=? AND status=?'
module.exports.getValidWalletByUserId = 'SELECT * FROM wallet WHERE kyc_status IN ("AADHAAR_KYC","FULL_KYC") AND user_id = ?'
module.exports.getTranscationDetail = 'select * from transaction where user_id = ?'
module.exports.getTranscationDetailByTxid = 'select * from transaction where transaction_id = ?'
module.exports.getTranscationByid = 'select * from transaction where id = ?'
module.exports. findTranscationUserid = 'SELECT * FROM transaction where transaction_id = ? AND user_id = ?'
module.exports.Beneficiary = 'select * from beneficiary where beneficiary_id = ?'
module.exports.getValidRequest = 'select * from request_money where user_id=? AND wallet_mobile=? AND amount=? AND  request_status=? AND status=? ORDER BY date_created DESC'
module.exports.updateValidRequest='update request_money set request_status=? where user_id=? AND wallet_mobile=? AND amount=? AND status=?'
module.exports.getPlayerId='select * from mpin where user_id=?'
module.exports.insertIntoNotification = 'insert into notification (user_id,title,content,type,status,date_created) VALUES ?'


// Transcation
module.exports.findTranscation = 'select * from transaction where user_id = ? AND type = ? AND show_to_user = ? ORDER BY id DESC LIMIT 6'
module.exports.findTranscationid = 'select * from transaction where transaction_id = ?'
module.exports.addTranscation = 'insert into transaction (transaction_id,reversal_transaction_reference,user_id,amount,transaction_type,type,sender_id,reciver_id,tag,transaction_reference_number,yes_bank_reference_number,remark,status,show_to_user,date_created) VALUES ?'
//module.exports.addTranscation = 'insert into transaction (transaction_id,user_id,amount,transaction_type,type,status,show_to_user,reversal_transaction_reference,tag,remark,sender_id,reciver_id,date_created) VALUES ?'
module.exports.selectTransactionMeta='select * from transaction_billpayment_meta where transaction_id = ?'
module.exports.addTranscationMeta = 'INSERT INTO transaction_billpayment_meta( transaction_id, bill_type, bill_carrier, service_id, consumer_key, payment_mode) VALUES ? '
module.exports.addTranscationMetaEmitra = 'INSERT INTO transaction_billpayment_meta( transaction_id, bill_type, bill_carrier, service_id, consumer_key) VALUES ? '
module.exports.updateTranscation = 'UPDATE transaction SET transaction_reference_number = ?,yes_bank_reference_number = ? WHERE id = ?'
module.exports.updateTranscationBillPaymentMeta = 'UPDATE transaction_billpayment_meta SET emitra_transactionid = ?,emitra_receiptno = ?,emitra_paidamount = ?,emitra_timestamp = ?,payment_mode = ?,payment_mode_bid = ?,payment_mode_timestamp = ?,emitra_status = ?,response_code = ? WHERE transaction_id = ?'
module.exports.updateBankStatus='update transaction SET transaction_reference_number = ?,yes_bank_reference_number = ?, status=?  WHERE transaction_id = ?'
module.exports.updateWalletBalance = 'UPDATE wallet SET wallet_balance =? WHERE user_id=?'
// module.exports.updateTransactionStatus = 'update transaction set transaction_reference_number=? AND status=? where user_id=?'
// module.exports.updateTranscation = 'UPDATE transaction SET transaction_reference_number = ?,yes_bank_reference_number = ? WHERE id = ?'
// module.exports.updateTranscationStatus = 'UPDATE transaction SET status = ? where id = ?'
module.exports.loadReversalStatus = 'select * from transaction where type = ? and status = ? and date_created > ? and user_id = ? Order by date_created DESC'
module.exports.scloadReversal = 'select * from transaction where type = ? and status =? and date_created < ? and date_created > ? Order by date_created DESC'
module.exports.updateTranscationStatus = 'UPDATE transaction SET status = ?,txid = ? where id = ?'
module.exports.addMetaTransaction = 'INSERT INTO transaction_load_meta (transaction_id,rpp_txn_id,payment_mode,payment_mode_bid,rpp_txn_status) VALUES ?'
module.exports.updateTXStatus = 'UPDATE transaction SET status = ? where transaction_id = ?'
module.exports.updateTxId = 'UPDATE transaction SET txid = ? where id = ?'


//wallet
module.exports.checkWalletByID = 'SELECT * FROM wallet WHERE user_id = ?'
module.exports.checkWalletByMobile= 'select * from wallet where wallet_mobile = ?'
module.exports.getWalletByID = 'select * from wallet where kyc_status IN("AADHAAR_KYC","FULL_KYC") AND user_id = ?'
module.exports.getWalletByMobile = 'SELECT * FROM wallet WHERE kyc_status IN ("AADHAAR_KYC","FULL_KYC") AND wallet_mobile = ?'
module.exports.updatestatus = 'update wallet SET kyc_status = ?  WHERE user_id = ?'
module.exports.getValidWallet = 'SELECT * FROM wallet where kyc_status IN ("AADHAAR_KYC","FULL_KYC") AND wallet_mobile = ?'
module.exports.addUserInWallet = 'insert into wallet (user_id,wallet_mobile,kyc_status,date_created) value ?'
module.exports.getuserbyaddress = 'select * from wallet where address = ?'
module.exports.updateNew='update transaction SET transaction_reference_number = ?,status=?,txid=?  WHERE transaction_id = ?'
module.exports.updateNewyesBank='update transaction SET transaction_reference_number = ?,yes_bank_reference_number,status=? where transaction_id = ?'
module.exports.updateWalletAddress = 'update wallet set addressess = ? where user_id = ?'

//mypassbook
module.exports.findaddress = 'select * from wallet where user_id = ?'
module.exports.showtouser =  'select * from transaction where show_to_user=? AND user_id=? LIMIT ? '
module.exports.getdatabydate = 'select * from transaction where show_to_user=? AND user_id=? AND date_created BETWEEN ? AND ? ORDER BY date_created DESC LIMIT ? OFFSET ?'


//getnotification 
module.exports.getnotification = 'select * from notification where  user_id=?  ORDER BY id DESC LIMIT ? OFFSET ?'
//revenuehead
module.exports.selectrevenuehead = 'SELECT * FROM revenue_head WHERE service_id = ?'

//beneficiary
module.exports.readreceiver_id = 'SELECT * FROM beneficiary WHERE id = ?'

//transaction_billpayment_meta
// Operation
module.exports.findifsc = 'select * from bank_ifs_code where ifsc = ?'
module.exports.getBeneficiary = 'select * from beneficiary where user_id = ? AND type = ? AND account_no = ? AND ifsc_code = ?'
module.exports.addNewBeneficiary = 'INSERT INTO beneficiary(beneficiary_id, user_id, name, type, account_no, ifsc_code, email, status, mobile_no, date_created, date_last_edit) VALUES ? '
module.exports.updateBeneficiary = 'update beneficiary set status=?,mobile_no=?,email=? where beneficiary_id = ?'
module.exports.fetchBeneficiary = 'select * from beneficiary where beneficiary_id = ? AND status = ? '
module.exports.getBeneficiaryByUserIDandBenID = 'select * from beneficiary where user_id = ? AND beneficiary_id = ? '
module.exports.updateBeneficiaryStatus = 'update beneficiary set status=? where beneficiary_id = ?'
module.exports.getUserBeneficiaries = 'select * from beneficiary where user_id = ? AND type = ?'
module.exports.findUserBankAccount = 'select * from user_bank_account where user_id = ?'
module.exports.addNewAccount = 'insert into user_bank_account (user_id,account_no,ifsc_code,is_verified,account_validation_id,account_created_at,account_verified_at,created_at,updated_at) VALUES ?'
module.exports.updateAccount = 'update user_bank_account set account_no=?,ifsc_code=?,is_verified=?,account_validation_id=?,account_created_at=?,account_verified_at=?,created_at=?,updated_at=? where user_id=?'
module.exports.updateAccountVarify = 'update user_bank_account set is_verified=?, account_verified_at=?, updated_at=? where account_validation_id = ? || user_id=?'
module.exports.updateAccountModify = 'update user_bank_account set account_no=?, ifsc_code=?, account_validation_id=? account_created_at=?, updated_at=? where account_validation_id = ? || user_id=?'
module.exports.findUsers = 'select * from users where id = ?'

//wallet
module.exports.walletQuery = 'SELECT * FROM wallet WHERE user_id = ?'
module.exports.getAddressesByMobile='select (addressess)  from wallet where wallet_mobile=?'
module.exports.updateWalletBal= 'UPDATE wallet SET wallet_balance = ? WHERE user_id = ? AND wallet_mobile = ?'

//Transcation Meta Update
module.exports.updateTranscationMeta= 'UPDATE transaction_billpayment_meta SET emitra_transactionid = ?,emitra_receiptno = ?,emitra_paidamount = ?,emitra_timestamp = ?,payment_mode = ?,emitra_status = ? WHERE transaction_id = ?'

// Request Money
module.exports.getUser = 'select user_id from access_token where access_token = ?'
module.exports.getValidUserWallet = 'select * from wallet where user_id = ? and (kyc_status = "AADHAAR_KYC" or kyc_status = "FULL_KYC")'
module.exports.getValidUserByMobileNo = 'select * from wallet where wallet_mobile = ? and (kyc_status = "AADHAAR_KYC" or kyc_status = "FULL_KYC")'
module.exports.fetchRequestMoney = 'select * from request_money where user_id = ? and wallet_mobile = ? and status = ? Order by date_created DESC'
module.exports.getContent = 'select content from Content where slug = ?'
module.exports.insertRequestMoney = 'insert into request_money (user_id, wallet_mobile, amount, remark, date_created) VALUES ?'
module.exports.slectOneSignalID = 'select one_signal_id from mpin where user_id = ?'
module.exports.getUserName = 'select * from users where id = ?'
module.exports.getUserDetail = 'select * from users where sso_mobile =?'
module.exports.fetchRequestRecieved = 'select id, user_id, amount, wallet_mobile, remark, request_status, date_created from request_money where wallet_mobile = ? and status = ? Order by date_created DESC'
module.exports.fetchRequestSent = 'select id, user_id, amount, wallet_mobile, remark, request_status, date_created from request_money where user_id = ? and status = ? Order by date_created DESC'
module.exports.fetchLastRequestSent = 'select * from request_money where id = ? and user_id = ? and status = ?'
module.exports.setDeleteStatus = 'update request_money SET status = ? where id = ? '

//Transaction Count
module.exports.addTransactionCount = 'insert into transaction_count (status, api_name, transaction_status) VALUES ?'
module.exports.getAPIHitCounts = 'SELECT * FROM transaction_count  ORDER BY total_count ASC'
module.exports.getAPIhighestHitCounts = 'SELECT * FROM transaction_count  ORDER BY total_count DESC'
module.exports.getCountByComplete = 'SELECT COUNT(id) as APIStatusCount, status FROM transaction_count where api_name= ? GROUP BY status ORDER BY APIStatusCount ASC'
module.exports.getCountByStatus = 'SELECT COUNT(id) as Total_Hits_Count, status FROM transaction_count where api_name= ? GROUP BY status ORDER BY Total_Hits_Count ASC'
module.exports.getCountByTransStatus = 'SELECT COUNT(id) as Total_Hits_Count, transaction_status FROM transaction_count where api_name= ? GROUP BY transaction_status ORDER BY Total_Hits_Count ASC'
module.exports.getAllAPIStatus = 'SELECT api_name,success,failure,total_count FROM transaction_count'
//module.exports.getAllAPITransStatus = 'SELECT COUNT(id) as APIStatusCount, api_name, transaction_status FROM transaction_count GROUP BY api_name, transaction_status ORDER BY APIStatusCount ASC'
module.exports.getAllAPITransStatus = 'SELECT COUNT(id) as status_count, status FROM transaction where status != ? GROUP BY status ORDER BY status_count ASC'
module.exports.getUtilityPayment = 'SELECT COUNT(transaction_id) as total_count FROM transaction where type= ?'
module.exports.getUtilityTransStatus = 'SELECT COUNT(id) as status_count, status FROM transaction where type=? GROUP BY status'
module.exports.getTotalTransCount = 'SELECT COUNT(transaction_id) as total_count FROM transaction;'


//TotalNumberOfAPIServing
module.exports.TotalNumberofAPIServing = 'SELECT  count(distinct api_name) as TotalNumberofAPIserving from transaction_count'

//getusercounttotalinusertable
module.exports.getusercounttotal = 'SELECT  count(*) as usercount from users'


//getwalletcounttotalinusertable
module.exports.getwalletcounttotal = 'SELECT  count(*) as walletcount from wallet'



module.exports.MobiledeviceCount = 'UPDATE transaction_count SET mobile_count = mobile_count + 1 where api_name = "MPINLogin"'
module.exports.DesktopdeviceCount = 'UPDATE transaction_count SET desktop_count = desktop_count + 1 where api_name = "MPINLogin"'
module.exports.FamilyCount = 'SELECT count(DISTINCT bhamashah_id) as FamilyCount FROM users'
module.exports.getDeviceCount = 'SELECT mobile_count,desktop_count FROM transaction_count where api_name = "MPINLogin"'
module.exports.getKYCCount = "SELECT count(kyc_status) as KYCCompletedUsers FROM wallet WHERE kyc_status = 'AADHAAR_KYC'"
// content table

module.exports.getcontent = 'select * from content  where language = ? and slug = ?'
// API'S COUNT
module.exports.insertcount = 'UPDATE API_COUNTS SET API_S = ? + 1 WHERE API_NAME=?'

//gettodaytransactioncount
module.exports.gettodaytransaction = 'SELECT type,status, count(*) as count FROM transaction  where date_created Between ? AND ? GROUP BY type,status'

module.exports.addSuccessCount = 'UPDATE transaction_count SET success = success + 1 ,total_count = total_count+1 WHERE api_name=?'
module.exports.addFailureCount = 'UPDATE transaction_count SET failure = failure+ 1,total_count = total_count+1 WHERE api_name=?'
//Request_Money Table Dashboard API Count
module.exports.getTotalRequestAmountCount = 'SELECT SUM(amount) AS total_amount FROM request_money WHERE Date(date_created) BETWEEN ? AND ?'
module.exports.getDailyTotalRequestAmountCount = 'SELECT SUM(amount) AS total_amount FROM request_money'
module.exports.getTotalStatusAmountCount = 'SELECT COUNT(status) AS total_status, SUM(amount) AS total_amount FROM request_money WHERE status = ? AND Date(date_created) BETWEEN ? AND ?'
module.exports.getDailyTotalStatusAmountCount = 'SELECT COUNT(status) AS total_status, SUM(amount) AS total_amount FROM request_money WHERE status = ? AND Date(date_created) = CURRENT_DATE()'
module.exports.getTotalRequestStatusAmountCount = 'SELECT COUNT(request_status) AS total_status, SUM(amount) AS total_amount FROM request_money WHERE request_status = ? AND Date(date_created) BETWEEN ? AND ?'
module.exports.getDailyTotalRequestStatusAmountCount = 'SELECT COUNT(request_status) AS total_status, SUM(amount) AS total_amount FROM request_money WHERE request_status = ? AND (date_created) =  CURRENT_DATE()'

//Api response time 
module.exports.getApiResponseTime = 'SELECT api_name, response_time from API_Response_time where Date(start_time) BETWEEN ? AND ?'
module.exports.getDailyApiResponseTime = 'SELECT api_name, response_time from API_Response_time where Date(start_time) =  CURRENT_DATE()'

//Unique User Count 
module.exports.getUserCountByCurrentWeek = 'SELECT login_timestamp, COUNT(*) as count FROM ( SELECT DISTINCT sso_id, DATE_FORMAT(date_created, "%Y-%m-%d") AS login_timestamp FROM users WHERE date_created BETWEEN DATE_FORMAT(ADDDATE(CURDATE(), INTERVAL 1- DAYOFWEEK(CURDATE()) DAY), "%Y-%m-%d 00:00:00") AND DATE_FORMAT(ADDDATE(CURDATE(), INTERVAL 7- DAYOFWEEK(CURDATE()) DAY), "%Y-%m-%d 23:59:59")) users GROUP BY login_timestamp'
module.exports.getUserCountByCurrentMonth = 'SELECT login_timestamp, COUNT(*) as count FROM ( SELECT DISTINCT sso_id, DATE_FORMAT(date_created, "%Y-%m-%d") AS login_timestamp FROM users WHERE YEAR(date_created) = YEAR(NOW()) AND MONTH(date_created) = MONTH(NOW())) users GROUP BY login_timestamp'
module.exports.getUserCountByCurrentYear = 'SELECT login_timestamp, COUNT(*) as count FROM ( SELECT DISTINCT sso_id, DATE_FORMAT(date_created, "%Y-%m-%d") AS login_timestamp FROM users WHERE YEAR(date_created) = YEAR(NOW()) ) users GROUP BY login_timestamp'
module.exports.getUserCountByDates ='select date_created, count(distinct sso_id) as count from users where date(date_created) between ? and ? group by date_created'

// Wallet User Count by status
module.exports.getWalletUsersCountBySatus = 'SELECT count(user_id) as count, status FROM wallet group by status'

//Get API Response Time
module.exports.updateAPIResponseTime = 'Update API_Response_time set status=?, type=?, start_time=?, end_time=?, response_time=? where api_name=?'

//Wallet Balance
module.exports.getWalletBalance = 'SELECT SUM(wallet_balance) as balance from wallet'

//FAQ Queries
module.exports.getFaqList = 'SELECT id, question, answer from faqs where language = ? and status = 1'
module.exports.updateFaq = 'Update faqs set answer = ? where id = ?'
module.exports.deleteFaq = 'Update faqs set status = 0 where id = ?'
module.exports.createFaq = 'Insert into faqs (language, question, answer, status, date_created) VALUES ?'
//Logout
module.exports.Logout = 'update access_token set access_token=? where id = ?'

//loadreversalscheduler

module.exports.loadreversalfind = 'select * from transaction where type=? AND status=? AND date_created >= ? AND  date_created <= ? '
module.exports.gettransactionbyid = 'select * from transaction where id=?'
module.exports.updatetransstatus = 'UPDATE transaction SET status =? where id=?'

//update transaction_load_meta

module.exports.transaction_load_meta = 'UPDATE transaction_load_meta SET rpp_txn_id = ?,payment_mode = ?,payment_mode_bid = ?,rpp_txn_status = ? WHERE transaction_id = ?'
