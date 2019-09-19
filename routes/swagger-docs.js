/**
 * @author: Vikram Viswanathan
 * @version: 1.0.0
 * @date: October 05, 2018
 * @Description: Implementation of Swagger definitions for Swagger API documentation.
 */

 /**
 * @swagger
 * definitions:
 *   authenticateSSOIDRequest:
 *     properties:
 *       UserName:
 *         type: string
 *         example: "goverdhansingh123"
 *       Password:
 *         type: string
 *         example: "padawas@123"
 *       Application:
 *         type: string
 *         example: "Bhamashah"
 *  
 *   SSOProfile:
 *     properties:
 *       SSOID:
 *         type: string
 *         example: "goverdhansingh123"
 *       adhar_Id:
 *         type: integer
 *         example: 916990139998 
 *       bhamashah_Id:
 *         type: string
 *         example: "VKWPJJP"
 *       bhamashahMemberId:
 *         type: string
 *         example: "VKWPJJP"
 *       dateOfBirth:
 *         type: string
 *         example: "null"
 *       gender:
 *         type: string
 *         example: "null"
 *       email:
 *         type: string
 *         example: "GOVERDHANSINGH123@RAJASTHAN.IN"
 *       Address:
 *         type: string
 *         example: "null"
 *       language:
 *         type: string
 *         example: "null"
 *       status:
 *         type: string
 *         example: "ACTIVE"
 *       date_created:
 *         type: string
 *         example: "2018-11-15 16:20:28"
 *       isSuccessful:
 *         type: string
 *         example: "true"
 * 
 *   authenticateSSOIDResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *         example: "OK"
 *       data:
 *         $ref: '#/definitions/SSOProfile'
 *       statusCode:
 *         type: number
 *         example: 200
 *       isSuccessful:
 *         type: string
 *         example: "true"
 *       success:
 *         type: string
 *         example: "true"
 */


 /**
 * @swagger
 * /authenticateSSOID:
 *   post:
 *     tags:
 *       - Login Services
 *     description: Returns the SSO profile details of the SSO ID provided.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: lang
 *         in: header
 *         required: false
 *         type: string
 *       - name: SSOID Authentication
 *         description: An object of SSO Login credentials
 *         in: body
 *         required: true  
 *         schema:
 *           $ref: '#/definitions/authenticateSSOIDRequest' 
 *     responses:
 *       200:
 *         description: An object of SSO Profile
 *         schema:
 *           $ref: '#/definitions/authenticateSSOIDResponse'
 */


 /**
 * @swagger
 * definitions:
 *   createMPINRequest:
 *     properties:
 *       userId:
 *         type: integer
 *         example: 29
 *       mpin:
 *         type: integer
 *         example: 1234
 *       confirmMpin:
 *         type: integer
 *         example: 1234
 *       deviceId:
 *         type: string
 *         example: hfefef
 *       oneSignalId:
 *         type: string
 *         example: 7ywbjhwbui
 *       lang:
 *         type: string
 *         example: "en"
 * 
 *   createMPINRes:
 *     properties:
 *       access_token:
 *         type: string
 *         example: "hwruiiwfwo10ri2wie7wxjol0v4bb"
 *       code:
 *         type: string
 *         example: "SA07"
 *       message: 
 *         type: string
 *         example: "Mpin created successfully"
 *       user :
 *           $ref: '#/definitions/createMPINuser'
 *   createMPINuser:
 *     properties:
 *       name:
 *         type: string
 *         example: "goverdhansingh123"
 *       date_created:
 *         type: string
 *         example: "2018-11-15 16:20:28"
 *       status_type:
 *         type: string
 *       sso_mobile:
 *         type: integer
 *         example: 9876543210
 *       adhar_Id:
 *         type: integer
 *         example: 916990139998 
 *       bhamashah_Id:
 *         type: string
 *         example: "VKWPJJP"
 *       bhamashahMemberId:
 *         type: string
 *         example: "7928197"
 *       wallet_present:
 *         type: string
 *         example: "true"
 *       wallet_block:
 *         type: string
 *         example: "false"
 *       status_popupmessage_type:
 *         type: string
 *       user_id:
 *         type: integer
 *         example: "null"
 *       email:
 *         type: string
 *         example: "null"
 *       wallet_balance:
 *         type: integer
 *         example: 0
 *       date_last_edit:
 *         type: string
 *         example: "2018-11-15 16:20:28"
 *       status:
 *         type: string
 *         example: "null"
 *       wallet_mobile:
 *         type: integer
 *         example: 9876543210
 *       wallet_aadhaar_id:
 *         type: string
 *         example: "null"
 *   createMpinResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *         example: "OK"
 *       data:
 *         $ref: '#/definitions/createMPINRes'
 *        
 *       statusCode:
 *         type: number
 *         example: 200
 *       isSuccessful:
 *         type: string
 *         example: "true"
 *       success:
 *         type: string
 *         example: "true"
 * 
 
 */


 /**
 * @swagger
 * /createMPIN:
 *   post:
 *     tags:
 *       - Login Services
 *     description: Returns the user details of the sso user provided.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: lang
 *         in: header
 *         required: false
 *         type: string
 *       - name: CreateMPIN
 *         description: An object of MPIN creation
 *         in: body
 *         required: true  
 *         schema:
 *           $ref: '#/definitions/createMPINRequest' 
 *     responses:
 *       200:
 *         description: An object of MPIN creation
 *         schema:
 *           $ref: '#/definitions/createMpinResponse'
 */

 /**
 * @swagger
 * definitions:
 *   loginMPINRequest:
 *     properties:
 *       mpinCode:
 *         type: integer
 *         example: 1234
 *       deviceId:
 *         type: string
 *         example: "hfefef"
 *       oneSignalId:
 *         type: string
 *         example: 7ywbjhwbui
 *       lang:
 *         type: string
 *         example: "en"
 *  
 *   loginMPINRes:
 *     properties:
 *       access_token:
 *         type: string
 *         example: "hwruiiwfwo10ri2wie7wxjol0v4bb"
 *       code:
 *         type: string
 *         example: "SA08"
 *       message: 
 *         type: string
 *         example: "Successfully Logged In"
 *       user:
 *          $ref: '#/definitions/loginMpinuser'
 *   loginMpinuser:
 *     properties:
 *       name:
 *         type: string
 *         example: "goverdhansingh123"
 *       date_created:
 *         type: string
 *         example: "2018-11-15 16:20:28"
 *       status_type:
 *         type: string
 *       sso_mobile:
 *         type: integer
 *         example: 9876543210
 *       adhar_Id:
 *         type: integer
 *         example: 916990139998 
 *       bhamashah_Id:
 *         type: string
 *         example: "VKWPJJP"
 *       bhamashahMemberId:
 *         type: string
 *         example: "7928197"
 *       wallet_present:
 *         type: string
 *         example: "true"
 *       wallet_block:
 *         type: string
 *         example: "false"
 *       status_popupmessage_type:
 *         type: string
 *       user_id:
 *         type: integer
 *         example: "null"
 *       email:
 *         type: string
 *         example: "null"
 *       wallet_balance:
 *         type: integer
 *         example: 0
 *       date_last_edit:
 *         type: string
 *         example: "2018-11-15 16:20:28"
 *       status:
 *         type: string
 *         example: "null"
 *       wallet_mobile:
 *         type: integer
 *         example: 9876543210
 *       wallet_aadhaar_id:
 *         type: string
 *         example: "null"
 
 *   loginMpinResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *         example: "OK"
 *       data:
 *         $ref: '#/definitions/loginMPINRes'
 *       statusCode:
 *         type: number
 *         example: 200
 *       isSuccessful:
 *         type: string
 *         example: "true"
 *       success:
 *         type: string
 *         example: "true"
 */
 /**
 * @swagger
 * /MPINLogin:
 *   post:
 *     tags:
 *       - Login Services
 *     description: Returns the user details of the Bhamashah wallet user provided.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: lang
 *         in: header
 *         required: false
 *         type: string
 *       - name: LoginMPIN
 *         description: An object of MPIN Login
 *         in: body
 *         required: true  
 *         schema:
 *           $ref: '#/definitions/loginMPINRequest' 
 *     responses:
 *       200:
 *         description: An object of MPIN login
 *         schema:
 *           $ref: '#/definitions/loginMpinResponse'
 */
/**
 * @swagger
 * definitions:
 *   forgotMPINRequest:
 *     properties:
 *       mobile:
 *         type: integer
 *         example: "9602391855"
 *       mobile_type:
 *         type: string
 *         example: "bank"
 *   forgotMPINRes:
 *     properties:
 *       code:
 *         type: string
 *         example: "SA04"
 *       message: 
 *         type: string
 *         example: "OTP sent successfully."
 *       ref_no:
 *         type: number
 *         example: 75508332
 
 *   forgotMpinResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *         example: "OK"
 *       data:
 *         $ref: '#/definitions/forgotMPINRes'
 *       statusCode:
 *         type: number
 *         example: 200
 *       isSuccessful:
 *         type: string
 *         example: "true"
 *       success:
 *         type: string
 *         example: "true"
 */
 /**
 * @swagger
 * /forgotMpin:
 *   post:
 *     tags:
 *       - Login Services
 *     description: Forgot MPIN and error will be as a same format
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: lang
 *         in: header
 *         required: false
 *         type: string
 *       - name: Forgot MPIN
 *         description: An object of forgot MPIN and error will be as a same format instead of data it will be error
 *         in: body
 *         required: true  
 *         schema:
 *           $ref: '#/definitions/forgotMPINRequest' 
 *     responses:
 *       200:
 *         description: An object of MPIN login
 *         schema:
 *           $ref: '#/definitions/forgotMpinResponse'
 */
/**
 * @swagger
 * definitions:
 *   verifyMPINOTPRequest:
 *     properties:
 *       otp:
 *         type: integer
 *         example: 563078
 *       ref_no:
 *         type: string
 *         example: "41284777"
 *   verifyMPINOTPRes:
 *     properties:
 *       code:
 *         type: string
 *         example: "SA05"
 *       message: 
 *         type: string
 *         example: "OTP verified successfully."
 *       status_popupmessage_type:
 *         type: string
 *         example: ""
 *       status_type:
 *         type: string
 *         example: ""
 
 *   verifyMpinOTPResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *         example: "OK"
 *       data:
 *         $ref: '#/definitions/verifyMPINOTPRes'
 *       statusCode:
 *         type: number
 *         example: 200
 *       isSuccessful:
 *         type: string
 *         example: "true"
 *       success:
 *         type: string
 *         example: "true"
 */
 /**
 * @swagger
 * /verifyMpinOTP:
 *   post:
 *     tags:
 *       - Login Services
 *     description: verify MPIN and error will be as a same format
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: lang
 *         in: header
 *         required: false
 *         type: string
 *       - name: verify MPIN
 *         description: An object of verify MPIN and error will be as a same format instead of data it will be error
 *         in: body
 *         required: true  
 *         schema:
 *           $ref: '#/definitions/verifyMPINOTPRequest' 
 *     responses:
 *       200:
 *         description: An object of MPIN login
 *         schema:
 *           $ref: '#/definitions/verifyMpinOTPResponse'
 */
/**
 * @swagger
 * definitions:
 *   changeMPINRequest:
 *     properties:
 *       old_mpin:
 *         type: integer
 *         example: 5678
 *       new_mpin:
 *         type: integer
 *         example: 1234
 *       confirm_mpin:
 *         type: integer
 *         example: 1234
 *   changeMPINRes:
 *     properties:
 *       code:
 *         type: string
 *         example: "CP00"
 *       message: 
 *         type: string
 *         example: "Mpin changed successfully"
 *       status_popupmessage_type:
 *         type: string
 *         example: ""
 *       status_type:
 *         type: string
 *         example: ""
 
 *   changeMpinResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *         example: "OK"
 *       data:
 *         $ref: '#/definitions/verifyMPINOTPRes'
 *       statusCode:
 *         type: number
 *         example: 200
 *       isSuccessful:
 *         type: string
 *         example: "true"
 *       success:
 *         type: string
 *         example: "true"
 */
 /**
 * @swagger
 * /changeMpin:
 *   post:
 *     tags:
 *       - Change MPIN
 *     description: change MPIN and error will be as a same format
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: lang
 *         in: header
 *         required: false
 *         type: string
 * 
 *       - name: change MPIN
 *         description: An object of change MPIN and error will be as a same format instead of data it will be error
 *         in: body
 *         required: true  
 *         schema:
 *           $ref: '#/definitions/changeMPINRequest' 
 *     responses:
 *       200:
 *         description: An object of MPIN login
 *         schema:
 *           $ref: '#/definitions/changeMpinResponse'
 */

/**
 * @swagger
 * definitions:
 *   addBeneficiaryRequest:
 *     properties:
 *       beneficiary_name:
 *         type: string
 *       identifier_type:
 *         type: string
 *       account_number:
 *         type: string
 *       ifsc_code:
 *         type: string
 *       mobile_no:
 *         type: string
 *       email:
 *         type: string
 *  
 *   addBeneficiaryRes:
 *     properties:
 *      code:
 *       type: string
 *      message:
 *       type: string
 *      status_type:
 *       type: string
 *      status_popupmessage_type:
 *       type: string
 *      beneficiary_id:
 *       type: integer
 * 
 * 
 *   addBeneficiaryResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *       data:
 *         $ref: '#/definitions/addBeneficiaryRes'
 *       isSuccessful:
 *         type: boolean
 *       success:
 *         type: boolean
 *       statusCode:
 *         type: integer
 */


 /**
 * @swagger
 * /addBeneficiary:
 *   post:
 *     tags:
 *       - Payee Management
 *     description: Returns the added beneficiary details.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string 
 *       - name: Add Benificiary
 *         description: An object of beneficiary person
 *         in: body
 *         required: true 
 *         schema:
 *           $ref: '#/definitions/addBeneficiaryRequest' 
 *     responses:
 *       200:
 *         description: An object of beneficiary person
 *         schema:
 *           $ref: '#/definitions/addBeneficiaryResponse'
 */

 /**
 * @swagger
 * definitions:
 *   fetchBeneficiaryRequest:
 *     properties:
 *       beneficiary_id:
 *         type: string
 *  
 *   fetchBeneficiaryRes:
 *     properties:
 *       ifsc_code:
 *         type: string
 *       beneficiary_name:
 *         type: string
 *       beneficiary_id:
 *         type: integer
 *       status_popupmessage_type:
 *         type: string
 *       account_type:
 *         type: string
 *       code:
 *         type: integer
 *       status_type:
 *         type: string
 *       mobile:
 *         type: string
 *       account_no:
 *         type: string
 * 
 * 
 *   fetchBeneficiaryResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *       data:
 *         $ref: '#/definitions/fetchBeneficiaryRes'
 *       isSuccessful:
 *         type: boolean
 *       success:
 *         type: boolean
 *       statusCode:
 *         type: integer
 */


 /**
 * @swagger
 * /fetchBeneficiary:
 *   post:
 *     tags:
 *       - Payee Management
 *     description: Returns the fetch beneficiary details.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string 
 *       - name: Fetch Benificiary
 *         description: An object of beneficiary person
 *         in: body
 *         required: true 
 *         schema:
 *           $ref: '#/definitions/fetchBeneficiaryRequest' 
 *     responses:
 *       200:
 *         description: An object of beneficiary person
 *         schema:
 *           $ref: '#/definitions/fetchBeneficiaryResponse'
 */

 
/**
 * @swagger
 * definitions:
 *   deleteBeneficiaryRequest:
 *     properties:
 *       beneficiary_id:
 *         type: string
 *  
 *   deleteBeneficiaryRes:
 *     properties:
 *       code:
 *         type: string
 *       status_popupmessage_type:
 *         type: string
 *       status_type:
 *         type: string
 *       message:
 *         type: string
 * 
 * 
 *   deleteBeneficiaryResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *       data:
 *         $ref: '#/definitions/deleteBeneficiaryRes'
 *       isSuccessful:
 *         type: boolean
 *       success:
 *         type: boolean
 *       statusCode:
 *         type: integer
 */


 /**
 * @swagger
 * /deleteBeneficiary:
 *   post:
 *     tags:
 *       - Payee Management
 *     description: Returns the deleted beneficiary's status details.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string 
 *       - name: Delete Benificiary
 *         description: An object of beneficiary's status
 *         in: body
 *         required: true 
 *         schema:
 *           $ref: '#/definitions/deleteBeneficiaryRequest' 
 *     responses:
 *       200:
 *         description: An object of beneficiary 
 *         schema:
 *           $ref: '#/definitions/deleteBeneficiaryResponse'
 */

 //=========================

 /**
 * @swagger
 * definitions:
 *   logoutRequest:
 *     properties:
 *  
 *   logoutRes:
 *     properties:
 *       code:
 *         type: string
 *       status_popupmessage_type:
 *         type: string
 *       status_type:
 *         type: string
 *       message:
 *         type: string
 * 
 * 
 *   logoutResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *       data:
 *         $ref: '#/definitions/logoutRes'
 *       isSuccessful:
 *         type: boolean
 *       success:
 *         type: boolean
 *       statusCode:
 *         type: integer
 */


 /**
 * @swagger
 * /logout:
 *   post:
 *     tags:
 *       - Logout
 *     description: Returns the logout status details.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string 
 *     responses:
 *       200:
 *         description: An object of logout 
 *         schema:
 *           $ref: '#/definitions/logoutResponse'
 */

/**
 * @swagger
 * definitions:
 *   listBeneficiaryRequest:
 *     properties:
 *       beneficiary_type:
 *         type: string
 *  
 *   listBeneficiaryRes:
 *     properties:
 *       beneficiary_list:
 *        type: array
 *        example: [{"ifsc_code":"string", "beneficiary_id":"integer", "name":"string", "mobile_no":"integer", "type":"string", "account_no":"string"}]
 * 
 * 
 *   listBeneficiaryResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *       data:
 *         $ref: '#/definitions/listBeneficiaryRes'
 *       isSuccessful:
 *         type: boolean
 *       success:
 *         type: boolean
 *       statusCode:
 *         type: integer
 */


 /**
 * @swagger
 * /listBeneficiary:
 *   post:
 *     tags:
 *       - Payee Management
 *     description: Returns the deleted beneficiary's status details.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string 
 *       - name: List Benificiary
 *         description: An object of beneficiary list
 *         in: body
 *         required: true 
 *         schema:
 *           $ref: '#/definitions/listBeneficiaryRequest' 
 *     responses:
 *       200:
 *         description: An object of beneficiary list
 *         schema:
 *           $ref: '#/definitions/listBeneficiaryResponse'
 */


/**
 * @swagger
 * definitions:
 *   addOwnBankAccountRequest:
 *     properties:
 *       account_no:
 *         type: string
 *       ifsc_code:
 *         type: string
 *  
 *   addOwnBankAccountRes:
 *     properties:
 *       code:
 *         type: string
 *       message:
 *         type: string
 *       status_type:
 *         type: string
 *       status_popupmessage_type:
 *         type: string
 * 
 * 
 *   addOwnBankAccountResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *       isSuccessful:
 *         type: boolean
 *       success:
 *         type: boolean
 *       data:
 *         $ref: '#/definitions/addOwnBankAccountRes'
 *       statusCode:
 *         type: integer
 */


 /**
 * @swagger
 * /addOwnBankAccount:
 *   post:
 *     tags:
 *       - Banking Services Management
 *     description: Returns the account's details.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string 
 *       - name: Own Bank Account
 *         description: An object of Own Bank Account
 *         in: body
 *         required: true 
 *         schema:
 *           $ref: '#/definitions/addOwnBankAccountRequest' 
 *     responses:
 *       200:
 *         description: An object of Own Bank Account
 *         schema:
 *           $ref: '#/definitions/addOwnBankAccountResponse'
 */

 /**
 * @swagger
 * definitions:
 *   verifyOwnBankAccountRequest:
 *     properties:
 *       amount:
 *         type: string
 *  
 *   verifyOwnBankAccountRes:
 *     properties:
 *       code:
 *         type: string
 *       message:
 *         type: string
 *       status_type:
 *         type: string
 *       status_popupmessage_type:
 *         type: string
 * 
 * 
 *   verifyOwnBankAccountResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *       isSuccessful:
 *         type: boolean
 *       success:
 *         type: boolean
 *       data:
 *         $ref: '#/definitions/verifyOwnBankAccountRes'
 *       statusCode:
 *         type: integer
 */


 /**
 * @swagger
 * /verifyOwnBankAccount:
 *   post:
 *     tags:
 *       - Banking Services Management
 *     description: Returns the account's details.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string 
 *       - name: verifyOwnBankAccount
 *         description: An object of verify Own Bank Account
 *         in: body
 *         required: true 
 *         schema:
 *           $ref: '#/definitions/verifyOwnBankAccountRequest' 
 *     responses:
 *       200:
 *         description: An object of verify Own Bank Account
 *         schema:
 *           $ref: '#/definitions/verifyOwnBankAccountResponse'
 */


/**
 * @swagger
 * definitions:
 *   modifyOwnBankAccountRequest:
 *     properties:
 *       account_no:
 *         type: string
 *       ifsc_code:
 *         type: string
 *  
 *   modifyOwnBankAccountRes:
 *     properties:
 *       code:
 *         type: string
 *       message:
 *         type: string
 *       status_type:
 *         type: string
 *       status_popupmessage_type:
 *         type: string
 * 
 * 
 *   modifyOwnBankAccountResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *       isSuccessful:
 *         type: boolean
 *       success:
 *         type: boolean
 *       data:
 *         $ref: '#/definitions/modifyOwnBankAccountRes'
 *       statusCode:
 *         type: integer
 */


 /**
 * @swagger
 * /modifyOwnBankAccount:
 *   post:
 *     tags:
 *       - Banking Services Management
 *     description: Returns the account's modification details.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string 
 *       - name: Modify Own Bank Account
 *         description: An object of Account modification
 *         in: body
 *         required: true 
 *         schema:
 *           $ref: '#/definitions/modifyOwnBankAccountRequest' 
 *     responses:
 *       200:
 *         description: An object of Account modification
 *         schema:
 *           $ref: '#/definitions/modifyOwnBankAccountResponse'
 */

/**
 * @swagger
 * definitions:
 *   fetchBeneficiaryRequest:
 *     properties:
 *       beneficiary_id:
 *         type: string
 *  
 *   fetchBeneficiaryRes:
 *     properties:
 *       ifsc_code:
 *         type: string
 *       beneficiary_name:
 *         type: string
 *       beneficiary_id:
 *         type: integer
 *       status_popupmessage_type:
 *         type: string
 *       account_type:
 *         type: string
 *       code:
 *         type: integer
 *       status_type:
 *         type: string
 *       mobile:
 *         type: string
 *       account_no:
 *         type: string
 * 
 * 
 *   fetchBeneficiaryResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *       data:
 *         $ref: '#/definitions/fetchBeneficiaryRes'
 *       isSuccessful:
 *         type: boolean
 *       success:
 *         type: boolean
 *       statusCode:
 *         type: integer
 */


 /**
 * @swagger
 * /fetchBeneficiary:
 *   post:
 *     tags:
 *       - Payee Management
 *     description: Returns the fetch beneficiary details.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string 
 *       - name: Fetch Benificiary
 *         description: An object of beneficiary person
 *         in: body
 *         required: true 
 *         schema:
 *           $ref: '#/definitions/fetchBeneficiaryRequest' 
 *     responses:
 *       200:
 *         description: An object of beneficiary person
 *         schema:
 *           $ref: '#/definitions/fetchBeneficiaryResponse'
 */


 /**
 * @swagger
 * definitions:
 *   getbhamashahstatusRequest:
 *     properties:
 *       BHAMASHAH_ACK_ID:
 *         type: string
 *       AADHAR_ID:
 *         type: string
 *       MOBILE_NO:
 *         type: string
 *
 *   getbhamashahstatusRes:
 *     properties:
 *       status:
 *         type: string
 *       statuscode:
 *         type: string
 *       message:
 *         type: string
 * 
 *   getbhamashahstatusResponse:
 *     properties:
 *       statusCode:
 *         type: integer
 *       statusMessage:
 *         type: string
 *       data:
 *         $ref: '#/definitions/getbhamashahstatusRes'
 */


 /**
 * @swagger
 * /getbhamashahstatus:
 *   POST:
 *     tags:
 *       - Bhamashah
 *     description: Returns the status details.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Bhamashah Status
 *         description: An object of status
 *         in: body
 *         required: true 
 *         schema:
 *           $ref: '#/definitions/getbhamashahstatusRequest' 
 *     responses:
 *       200:
 *         description: An object of status
 *         schema:
 *           $ref: '#/definitions/getbhamashahstatusResponse'
 */

  /**
 * @swagger
 * definitions:
 *   getbhamashahstatusRequest:
 *     properties:
 *       BHAMASHAH_ACK_ID:
 *         type: string
 *       AADHAR_ID:
 *         type: string
 *       MOBILE_NO:
 *         type: string
 *
 *   getbhamashahstatusRes:
 *     properties:
 *       status:
 *         type: string
 *       statuscode:
 *         type: string
 *       message:
 *         type: string
 * 
 *   getbhamashahstatusResponse:
 *     properties:
 *       statusCode:
 *         type: integer
 *       statusMessage:
 *         type: string
 *       data:
 *         $ref: '#/definitions/getbhamashahstatusRes'
 */


 /**
* @swagger
* definitions:
*   getbhamashahstatusRequest:
*     properties:
*       BHAMASHAH_ACK_ID:
*         type: string
*       AADHAR_ID:
*         type: string
*       MOBILE_NO:
*         type: string
*
*   getbhamashahstatusRes:
*     properties:
*       status:
*        type: string
*       code:
*        type: string
*       message:
*        type: string
*
*
*   getbhamashahstatusResponse:
*     properties:
*       statuscode:
*         type: string
*       statusmessage:
*         type: string
*       data:
*         $ref: '#/definitions/getbhamashahstatusRes'
*/
/**
* @swagger
* /getbhamashahstatus:
*   post:
*     tags:
*       - Bhamshah Yojana
*     description: Returns the Bhamshah Status of user.
*     produces:
*       - application/json
*     parameters:
*       - name: Bhamashah Status Object
*         description: An object of Bhamashah Status
*         in: body
*         required: true
*         schema:
*           $ref: '#/definitions/getbhamashahstatusRequest'
*     responses:
*       200:
*         description: An object of Bhamashah Status REsponse
*         schema:
*           $ref: '#/definitions/getbhamashahstatusResponse'
*/
/**
* @swagger
* definitions:
*   enrollmentdetailsRequest:
*     properties:
*       BHAMASHAH_ID:
*         type: string
*       BHAMASHAH_ACK_ID:
*         type: string
*       AADHAR_ID:
*         type: string
*       MOBILE_NO:
*         type: string
*
*   enrollmentdetailsRes:
*     properties:
*       status:
*        type: string
*       code:
*        type: string
*       message:
*        type: string
*
*
*   enrollmentdetailsResponse:
*     properties:
*       statuscode:
*         type: string
*       statusmessage:
*         type: string
*       data:
*         $ref: '#/definitions/enrollmentdetailsRes'
*/
/**
* @swagger
* /getenrollmentdetails:
*   post:
*     tags:
*       - Bhamshah Yojana
*     description: Returns the ENroll Details of user.
*     produces:
*       - application/json
*     parameters:
*       - name: Enrollment Details Object
*         description: An object of Enrollment DEtails
*         in: body
*         required: true
*         schema:
*           $ref: '#/definitions/enrollmentdetailsRequest'
*     responses:
*       200:
*         description: An object of Enrollment DEtails REsponse
*         schema:
*           $ref: '#/definitions/enrollmentdetailsResponse'
*/
/**
* @swagger
* definitions:
*   DBTdetailsRequest:
*     properties:
*       BHAMASHAH_ID:
*         type: string
*       BHAMASHAH_ACK_ID:
*         type: string
*       AADHAR_ID:
*         type: string
*       MOBILE_NO:
*         type: string
*
*   DBTdetailsRes:
*     properties:
*       status:
*        type: string
*       code:
*        type: string
*       message:
*        type: string
*
*
*   DBTdetailsResponse:
*     properties:
*       statuscode:
*         type: string
*       statusmessage:
*         type: string
*       data:
*         $ref: '#/definitions/DBTdetailsRes'
*/
/**
* @swagger
* /getDBTDetails:
*   post:
*     tags:
*       - Bhamshah Yojana
*     description: Returns the DBT details of user.
*     produces:
*       - application/json
*     parameters:
*       - name: DBT details Object
*         description: An object of DBT details
*         in: body
*         required: true
*         schema:
*           $ref: '#/definitions/DBTdetailsRequest'
*     responses:
*       200:
*         description: An object of DBT details Response
*         schema:
*           $ref: '#/definitions/DBTdetailsResponse'
*/


 /**
 * @swagger
 * definitions:
 *   requestMoneyCreateRequest:
 *     properties:
 *      recipient_mobile:
 *         type: string
 *         example: "8952070183"
 *      amount:
 *         type: string
 *         example: "20"
 *      remark:
 *         type: string
 *         example: "testing"
 *      
 *           
 */

/**
 * @swagger
 * definitions:
 *   requestResponseObject:
 *     properties:
 *      code:
 *         type: string
 *         example: "SA02"
 *      status_popupmessage_type:
 *         type: string
 *         example: ""
 *      status_type:
 *         type: string
 *         example: ""
 *      message:
 *         type: string
 *         example: "Your Request has been sent to ABHISHEK KUMAR"     
 *           
 */

 /**
 * @swagger
 * definitions:
 *   requestMoneyCreateResponse:
 *     properties:
 *      statusReason:
 *         type: string
 *         example: "Ok"
 *      data:
 *         $ref: '#/definitions/requestResponseObject'
 *      isSuccessful:
 *         type: boolean
 *         example: true
 *      success:
 *         type: boolean
 *         example: true
 *      statusCode: 
 *         type: integer
 *         example: 200
 *          
 *           
 *           
 */
  
/**
 * @swagger
 * /requestMoneyCreate:
 *   post:
 *     tags:
 *       - Request for money Service
 *     description: Create request to send money.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         description: Check person belongs or not
 *         in: header
 *         required: true
 *       - name: user_language
 *         in: header
 *         required: false
 *         type: string
 *       - name: Request body
 *         description: Mandatory request items
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/requestMoneyCreateRequest'
 *     responses:
 *       200:
 *         description: Request for money is created successfully
 *         schema:
 *           $ref: '#/definitions/requestMoneyCreateResponse'
 */



/**
 * @swagger
 * definitions:
 *   moneyRecievedResponseObject:
 *     properties:
 *      id:
 *         type: string
 *         example: "11"
 *      user_id:
 *         type: string
 *         example: "14"
 *      amount:
 *         type: string
 *         example: "2"
 *      wallet_mobile:
 *         type: string
 *         example: "9462973473"
 *      remark:
 *         type: string
 *         example: "Food"
 *      request_status:
 *         type: string
 *         example: "0"
 *      date_created:
 *         type: string
 *         example: "2018-05-29T18:38:50.000Z"
 *      user_name:
 *         type: string
 *         example: "ASHISH KUMAR"
 *      
 */

/**
 * @swagger
 * definitions:
 *   moneyRecievedResponseData:
 *     properties:
 *      code:
 *         type: string
 *         example: "SA00"
 *      status_popupmessage_type:
 *         type: string
 *         example: ""
 *      status_type:
 *         type: string
 *         example: ""
 *      requests:
 *         $ref: '#/definitions/moneyRecievedResponseObject'
 *      message:
 *         type: string
 *         example: "Request successful"
 *      
 */

/**
 * @swagger
 * definitions:
 *   moneyRecievedResponse:
 *     properties:
 *      statusReason:
 *         type: string
 *         example: "Ok"
 *      data:
 *         $ref: '#/definitions/moneyRecievedResponseData'
 *      isSuccessful:
 *         type: boolean
 *         example: true
 *      success:
 *         type: boolean
 *         example: true
 *      statusCode: 
 *         type: integer
 *         example: 200
 *      
 */

 /**
 * @swagger
 * /requestMoneyRecieved:
 *   get:
 *     tags:
 *       - Request for money Service
 *     description: Get data of user who recieve request for money
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token 
 *         description: Recieve request for money
 *         in: header
 *         required: true
 *       - name: user_language
 *         in: header
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Recieve request for money is successfully
 *         schema:
 *           $ref: '#/definitions/moneyRecievedResponse'
 */



/**
 * @swagger
 * definitions:
 *   moneySentResponseObject:
 *     properties:
 *      id:
 *         type: string
 *         example: "22"
 *      user_id:
 *         type: string
 *         example: "12"
 *      amount:
 *         type: string
 *         example: "20"
 *      wallet_mobile:
 *         type: string
 *         example: "8952070183"
 *      remark:
 *         type: string
 *         example: "testing"
 *      request_status:
 *         type: string
 *         example: "0"
 *      date_created:
 *         type: string
 *         example: "2018-10-28T05:50:08.000Z"
 *      user_name:
 *         type: string
 *         example: "GAMBHEER SINGH"
 *      
 */

/**
 * @swagger
 * definitions:
 *   moneySentResponseData:
 *     properties:
 *      code:
 *         type: string
 *         example: "SA00"
 *      status_popupmessage_type:
 *         type: string
 *         example: ""
 *      status_type:
 *         type: string
 *         example: ""
 *      requests:
 *         $ref: '#/definitions/moneySentResponseObject'
 *      message:
 *         type: string
 *         example: "Request successful"
 *      
 */

/**
 * @swagger
 * definitions:
 *   moneySentResponse:
 *     properties:
 *      statusReason:
 *         type: string
 *         example: "Ok"
 *      data:
 *         $ref: '#/definitions/moneySentResponseData'
 *      isSuccessful:
 *         type: boolean
 *         example: true
 *      success:
 *         type: boolean
 *         example: true
 *      statusCode: 
 *         type: integer
 *         example: 200
 *      
 */

  /**
 * @swagger
 * /requestMoneySent:
 *   get:
 *     tags:
 *       - Request for money Service
 *     description: Get data of user to whom request for money is sent
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token 
 *         description: Sent request for money
 *         in: header
 *         required: true
 *       - name: user_language
 *         in: header
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Sent request for money is successfully
 *         schema:
 *           $ref: '#/definitions/sentRequestResponse'
 */


 
 /**
 * @swagger
 * definitions:
 *   deleteMoneyRequest:
 *     properties:
 *       recipient_id:
 *          type: string
 *          example: "1"
 *               
 */

/**
 * @swagger
 * definitions:
 *   deleteMoneyResponseObject:
 *     properties:
 *      code:
 *         type: string
 *         example: "SA03"
 *      status_popupmessage_type:
 *         type: string
 *         example: ""
 *      status_type:
 *         type: string
 *         example: ""
 *      message:
 *         type: string
 *         example: "Request deleted successfully"
 *      
 */

 /**
 * @swagger
 * definitions:
 *   deleteMoneyResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *         example: "Ok"
 *       error:
 *         $ref: '#/definitions/deleteMoneyResponseObject'
 *       isSuccessful:
 *         type: boolean
 *         example: true
 *       success:
 *         type: boolean
 *         example: true
 *       statusCode: 
 *         type: integer
 *         example: 200
 *               
 */

  /**
 * @swagger
 * /requestMoneyDelete:
 *   post:
 *     tags:
 *       - Request for money Service
 *     description: Delete request for money 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         description: Check person belongs or not
 *         in: header
 *         required: true
 *       - name: user_language
 *         in: header
 *         required: false
 *         type: string
 *       - name: Delete request 
 *         description: Delete request for money
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/deleteMoneyRequest'
 *     responses:
 *       200:
 *         description: Request for money is deleted successfully
 *         schema:
 *           $ref: '#/definitions/deleteMoneyResponse'
 */



 /**
 * @swagger
 * definitions:
 *   remindMoneyRequest:
 *     properties:
 *      recipient_id:
 *         type: string
 *         example: "8"
 *               
 */

/**
 * @swagger
 * definitions:
 *   remindMoneyResponseObject:
 *     properties:
 *      code:
 *         type: string
 *         example: "SA06"
 *      status_popupmessage_type:
 *         type: string
 *         example: ""
 *      status_type:
 *         type: string
 *         example: ""
 *      message:
 *         type: string
 *         example: "SMS has been sent to GAMBHEER SINGH for your request."
 *      
 */

 /**
 * @swagger
 * definitions:
 *   remindMoneyResponse:
 *     properties:
 *       statusResponse:
 *         type: string
 *         example: "Ok"
 *       error:
 *         $ref: '#/definitions/remindMoneyResponseObject'
 *       isSuccessful:
 *         type: boolean
 *         example: true
 *       success:
 *         type: boolean
 *         example: true
 *       statusCode: 
 *         type: integer
 *         example: 200
 *               
 */

  /**
 * @swagger
 * /requestMoneyReminder:
 *   post:
 *     tags:
 *       - Request for money Service
 *     description: Remind request for money 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         description: Check person belongs or not
 *         in: header
 *         required: true
 *       - name: user_language
 *         in: header
 *         required: false
 *         type: string
 *       - name: Remind request 
 *         description: Remind request for money
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/remindMoneyRequest'
 *     responses:
 *       200:
 *         description: Reminder for Request for money is successfully
 *         schema:
 *           $ref: '#/definitions/remindMoneyResponse'
 */

  /**
 * @swagger
 * /recentBillHistory:
 *   get:
 *     tags:
 *       - recentBillHistory
 *     description: Returns the added recentBillHistory details.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string 
 *         schema:
 *           $ref: '#/definitions/recentBillHistory' 
 *     responses:
 *       200:
 *         description: An object of recentBillHistory
 *         schema:
 *           $ref: '#/definitions/recentBillHistory'
 */

   /**
 * @swagger
 * definitions:
 *   actionBillPaymentVerify:
 *     properties:
 *      transaction_id:
 *         type: string
 *         example: "180518000404"
  *           
 */

 /**
 * @swagger
 * /actionBillPaymentVerify:
 *   post:
 *     tags:
 *       - actionBillPaymentVerify
 *     description: Emitra Bill Payment 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string 
 *       - name: transaction_id
 *         description: transaction_id
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/actionBillPaymentVerify'
 *     responses:
 *       200:
 *         description: Successfully created
 */


 /**
 * @swagger
 * definitions:
 *   actionBillPayment:
 *     properties:
 *      name:
 *         type: string
 *         example: "test"
 *      mobile:
 *         type: string
 *         example: "9462973473"
 *      email:
 *         type: string
 *         example: "asdf@gmail.com"
 *      amount:
 *         type: string
 *         example: "1"
 *      consumer_key:
 *         type: string
 *         example: "8440042182-100017993048"
 *      service_id:
 *         type: string
 *         example: "1219"
 *      office_code:
 *         type: string
 *         example: "VODAF123"
 *      lookupId:
 *         type: string
 *         example: "1219"    
 *      bill_type:
 *         type: string
 *         example: "1"
 *      bill_carrier:
 *         type: string
 *         example: "2"
  *         
 */
  
/**
 * @swagger
 * /actionBillPayment:
 *   post:
 *     tags:
 *       - actionBillPayment
 *     description: Emitra Bill Payment API
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string
 *       - name: actionBillPayment
 *         description: Emitra Bill Payment API
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/actionBillPayment'
 *     responses:
 *       200:
 *         description: Bill Payment Success
 */

  /**
 * @swagger
 * definitions:
 *   RppBillPayment:
 *     properties:
 *      name:
 *         type: string
 *         example: "test"
 *      mobile:
 *         type: string
 *         example: "9462973473"
 *      email:
 *         type: string
 *         example: "asdf@gmail.com"
 *      amount:
 *         type: string
 *         example: "1"
 *      consumer_key:
 *         type: string
 *         example: "8440042182-100017993048"
 *      service_id:
 *         type: string
 *         example: "1219"
 *      office_code:
 *         type: string
 *         example: "VODAF123"
 *      lookupId:
 *         type: string
 *         example: "1219"    
 *      bill_type:
 *         type: string
 *         example: "1"
 *      bill_carrier:
 *         type: string
 *         example: "2"
  *         
 */

 /**
 * @swagger
 * /RppBillPayment:
 *   post:
 *     tags:
 *       - RppBillPayment
 *     description: RppBillPayment API
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string
 *       - name: RppBillPayment
 *         description: RppBillPayment API
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/RppBillPayment'
 *     responses:
 *       200:
 *         description: RppBillPayment Success
 */

  /**
 * @swagger
 * definitions:
 *   RppBillPaymentStatus:
 *     properties:
 *      res:
 *         type: string
 *         example: "IXJhS4q0XnA/tJ/4lFLpvbbu3eGhdC2XAhyRy4j1o3i90LPwhGq92oSyvsWcyv78GWzPaMcU+b/n6J0i2xw5n8b+FPwiJDcJ0JOZbILjud01p7eBruo2iYsPCOmdfBY+xtBVn0GvA3QpZRr47N2BlZbv5IR7bmao9ZDUw3FpSmDv9MZV7ORDh8ttzt7nwYYDIQNQSDHyaWZNRgZ9uYqcKmwdqXXbJUp6vMSIVHr7Qp6IGSOwZlZ4m/dvNihLL8/KRZDL1UaYkdl9uamg18OPJxIwfYsbyVBGbZWrNkzT9Lq1V7D4O3Uc3RVFMFrTdNrSQE8gXsLmH60vpnfyIa4mpLD8XAtF/229HapsF0jr2ZOy7q3rzHnuZwZU0XX2m2cVt8RlHqNgsyEz8gXYZhA4YgfXLLoP/kIWjz+RivYqmpKwxsqWjUuIYP7X4bm0UMtqtsfuDhzB4FkY7MKOGWWoa1w1veK1FS/Owub9j0tRNmLyvhv+Ggtf03hdvxR52zi3QK2CBNWaPJ1mcRSpX1f+/mVO6IiHgzW31zIPy1ny3ZY="
 *      status:
 *         type: string
 *         example: "SUCCESS"
  *         
 */
  
/**
 * @swagger
 * /RppBillPaymentStatus:
 *   post:
 *     tags:
 *       - RppBillPaymentStatus
 *     description: RPP Bill Payment status API
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string
 *       - name: RppBillPaymentStatus
 *         description: RPP Bill Payment status API
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/RppBillPaymentStatus'
 *     responses:
 *       200:
 *         description: Successfully Created
 */

 /**
 * @swagger
 * definitions:
 *   fetchUserDetail:
 *     properties:
 *      serviceId:
 *         type: string
 *         example: "1234"
 *      searchKey:
 *         type: string
 *         example: "1234"
  *         
 */

 /**
 * @swagger
 * /fetchUserDetail:
 *   post:
 *     tags:
 *       - fetchUserDetail
 *     description: fetchUserDetail API
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string
 *       - name: fetchUserDetail
 *         description: fetchUserDetail API
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/fetchUserDetail'
 *     responses:
 *       200:
 *         description: fetchUserDetail Success
 */
  
/**
 * @swagger
 * definitions:
 *   loadMoneyToWalletReq:
 *     properties:
 *       p1:
 *         type: string
 *         example: "8952070183"
 *       p2:
 *         type: number
 *         example: 20
 *       p3:
 *         type: string
 *         example: "load"
 *       p4:
 *         type: string
 *         example: ""
 *       p5:
 *         type: string
 *         example: "test"
 *  
 *   loadMoneyToWalletRes:
 *     properties:
 *      code:
 *       type: string
 *      message:
 *       type: string
 *      merchant_transaction_number:
 *       type: string
 *      transaction_reference_number:
 *       type: string
 *      yes_bank_reference_number:
 *       type: string
 *      balance:
 *       type: string
 *      remaining_load_limit:
 *       type: integer
 *      tag_balance:
 *       type: string
 * 
 * 
 *   loadMoneyToWalletResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *       data:
 *         $ref: '#/definitions/loadMoneyToWalletRes'
 *       isSuccessful:
 *         type: boolean
 *       success:
 *         type: boolean
 *       statusCode:
 *         type: integer
 */
 /**
 * @swagger
 * /loadmoneytowallet:
 *   post:
 *     tags:
 *       - Load Money to Wallet
 *     description: Returns load Money To Wallet.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string 
 *       - name: loadMoneyToWallet
 *         description: An object of loadMoneyToWallet
 *         in: body
 *         required: true 
 *         schema:
 *           $ref: '#/definitions/loadMoneyToWalletReq' 
 *     responses:
 *       200:
 *         description: An object of loadMoneyToWallet
 *         schema:
 *           $ref: '#/definitions/loadMoneyToWalletResponse'
 */

 /**
 * @swagger
 * definitions:
 *   WalletToWalletReq:
 *     properties:
 *       amount:
 *         type: number
 *         example: 20
 *       tag_name:
 *         type: string
 *         example: "load"
 *       beneficiary_mobile:
 *         type: string
 *         example: "9768135452"
 *  
 *   WalletToWalletRes:
 *     properties:
 *      code:
 *       type: string
 *      message:
 *       type: string
 *      status_type:
 *       type: string
 *      status_popupmessage_type:
 *       type: string
 * 
 * 
 *   WalletToWalletResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *       data:
 *         $ref: '#/definitions/WalletToWalletRes'
 *       isSuccessful:
 *         type: boolean
 *       success:
 *         type: boolean
 *       statusCode:
 *         type: integer
 */
 /**
 * @swagger
 * /wallettowallet:
 *   post:
 *     tags:
 *       - Wallet To Wallet
 *     description: Wallet To Wallet.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string 
 *       - name: WalletToWallet
 *         description: WalletToWallet
 *         in: body
 *         required: true 
 *         schema:
 *           $ref: '#/definitions/WalletToWalletReq' 
 *     responses:
 *       200:
 *         description: WalletToWallet
 *         schema:
 *           $ref: '#/definitions/WalletToWalletResponse'
 */

 /**
 * @swagger
 * definitions:
 *   WalletToBankReq:
 *     properties:
 *       amount:
 *         type: number
 *         example: 20
 *       remark:
 *         type: string
 *         example: "load"
 *       beneficiary_id:
 *         type: number
 *         example: 14441
 *  
 *   WalletToBankRes:
 *     properties:
 *      code:
 *       type: string
 *      message:
 *       type: string
 *      status_type:
 *       type: string
 *      status_popupmessage_type:
 *       type: string
 * 
 * 
 *   WalletToBankResponse:
 *     properties:
 *       statusReason:
 *         type: string
 *       data:
 *         $ref: '#/definitions/WalletToBankRes'
 *       isSuccessful:
 *         type: boolean
 *       success:
 *         type: boolean
 *       statusCode:
 *         type: integer
 */
 /**
 * @swagger
 * /wallettoBank:
 *   post:
 *     tags:
 *       - Wallet To Bank
 *     description: Wallet To Bank.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string 
 *       - name: WalletToBank
 *         description: WalletToBank
 *         in: body
 *         required: true 
 *         schema:
 *           $ref: '#/definitions/WalletToBankReq' 
 *     responses:
 *       200:
 *         description: WalletToBank
 *         schema:
 *           $ref: '#/definitions/WalletToBankResponse'
 */
/**
 * @swagger
 * definitions:
 *   createWalletReq:
 *     properties:
 *       Mobile_Number:
 *         type: string
 *         example: "9640266349"
 *       UserId:
 *         type: string
 *         exampe: "10"
 *  
 *   createWalletRes:
 *     properties:
 *      code:
 *       type: string
 *      message:
 *       type: string
 *      mobile_number:
 *       type: string
 *      otp_ref_number:
 *       type: string
 * 
 * 
 *   createWalletResponse:
 *     properties:
 *       isSuccessful:
 *         type: boolean
 *       success:
 *         type: boolean
 *       data:
 *         $ref: '#/definitions/createWalletRes'
 *       statusCode:
 *         type: integer
 */
 /**
 * @swagger
 * /createWallet:
 *   post:
 *     tags:
 *       - createWallet
 *     description: Create Wallet.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string 
 *       - name: createWallet
 *         description: createWallet
 *         in: body
 *         required: true 
 *         schema:
 *           $ref: '#/definitions/createWalletReq' 
 *     responses:
 *       200:
 *         description: createWallet
 *         schema:
 *           $ref: '#/definitions/createWalletResponse'
 */
/**
 * @swagger
 * definitions:
 *   verifyMotpReq:
 *     properties:
 *       Mobile_Number:
 *         type: string
 *         example: "9640266349"
 *       UserId:
 *         type: string
 *         example: "10"
 *       ReferNo:
 *         type: string
 *         example: "26867"
 *       OTP:
 *         type: string
 *         example: "111111"
 *  
 *   verifyMotpRes:
 *     properties:
 *      code:
 *       type: string
 *      message:
 *       type: string
 *      mobile_number:
 *       type: string
 *      otp_ref_number:
 *       type: string
 * 
 * 
 *   verifyMotpResponse:
 *     properties:
 *       isSuccessful:
 *         type: boolean
 *       success:
 *         type: boolean
 *       data:
 *         $ref: '#/definitions/verifyMotpRes'
 *       statusCode:
 *         type: integer
 */
 /**
 * @swagger
 * /verifyMotp:
 *   post:
 *     tags:
 *       - verifyMotp
 *     description: verifyMotp.
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string 
 *       - name: verifyMotp
 *         description: verifyMotp
 *         in: body
 *         required: true 
 *         schema:
 *           $ref: '#/definitions/verifyMotpReq' 
 *     responses:
 *       200:
 *         description: Successfully created
 */


 //Aadhar Services 

 /**
 * @swagger
 * definitions:
 *   aadharRegistration:
 *     properties:
 *      auth_token:
 *         type: string
 *         example: "x0T5sE22eBWdD-CTIZsKBG-4b6tsZoSDqV5UCyd7igxWevfB3b_AaCT76PCfBKZ"
 *      aadhar_no:
 *          type: string
 *          example: "600733443833"
 *               
 */

/**
 * @swagger
 * /registeraadharkyc:
 *   post:
 *     tags:
 *       - Aadhar registration
 *     description: request for Aadhar registration 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         description: Check person belongs or not
 *         in: header
 *         required: true
 *         type: string
 *       - name: user_language
 *         in: header
 *         required: false
 *         type: string
 *       - name: Aadhar Registration 
 *         description: request for Aadhar registration 
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/aadharRegistration'
 *     responses:
 *       200:
 *         description: Aadhar registration
 *         schema:
 *           $ref: '#/definitions/aadharRegistration'
 */
 


 /**
 * @swagger
 * definitions:
 *   aadharOtpVerification:
 *     properties:
 *      otp:
 *         type: string
 *         example: "438563"
 *      transaction_id:
 *          type: string
 *          example: "181102017591"
 *      otp_transaction_id:
 *          type: string
 *          example: "414464"
 *          
 *               
 */

/**
 * @swagger
 * /verifyaadharotp:
 *   post:
 *     tags:
 *       - Aadhar registration
 *     description: OTP Verification 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         description: Check person belongs or not
 *         in: header
 *         required: true
 *       - name: user_language
 *         in: header
 *         required: false
 *         type: string
 *       - name: OTP Verification 
 *         description: OTP Verification
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/aadharOtpVerification'
 *     responses:
 *       200:
 *         description: OTP Verification
 *         schema:
 *           $ref: '#/definitions/aadharOtpVerification'
 */
 

 // Myprofile



 /**
 * @swagger
 * definitions:
 *   MyProfile:
 *     properties:
 *      id:
 *         type: string
 *         example: "10"
 *               
 */

 /**
 * @swagger
 * /readprofilesection:
 *   post:
 *     tags:
 *       - My Profile
 *     description: Fetch user Profile
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: My Profile
 *         description: Fetch user Profile
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/MyProfile'
 *     responses:
 *       200:
 *         description: Successfully created
 */


 //closewallet


/**
 * @swagger
 * definitions:
 *   closewallet:
 *     properties:
 *      auth_token:
 *         type: string
 *         example: "a5f69162-5a61-429e-949d-22c408869ec7"
 *      aadhar_no:
 *          type: string
 *          example: "886035523300"
 *          
 *               
 */

/**
 * @swagger
 * /closewallet:
 *   post:
 *     tags:
 *       - Wallet closed for users
 *     description: Wallet closed for users 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         description: Check person belongs or not
 *         in: header
 *         required: true
 *       - name: user_language
 *         in: header
 *         required: false
 *         type: string
 *       - name: close wallet
 *         description: close wallet
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/closewallet'
 *     responses:
 *       200:
 *         description: OTP Verification
 *         schema:
 *           $ref: '#/definitions/closewallet'
 */




 //mypassbook


/**
 * @swagger
 * definitions:
 *  Mypassbook:
 *     properties:
 *      days:
 *         type: string
 *         example: "0"
 *      page:
 *          type: string
 *          example: "1"
 *          
 *               
 */

/**
 * @swagger
 * /readpassbook:
 *   post:
 *     tags:
 *       - Fetch transaction history 
 *     description: Fetch transaction history
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         description: Check person belongs or not
 *         in: header
 *         required: true
 *       - name: user_language
 *         in: header
 *         required: false
 *         type: string
 *       - name: Fetch transaction History
 *         description: Fetch transaction History
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Mypassbook'
 *     responses:
 *       200:
 *         description: Fetch transaction History
 *         schema:
 *           $ref: '#/definitions/Mypassbook'
 */

/**
 * @swagger
 * definitions:
 *   getFaqsObject:
 *     properties:
 *      code:
 *         type: string
 *         example: "SA00"
 *      status_popupmessage_type:
 *         type: string
 *         example: ""
 *      status_type:
 *         type: string
 *         example: ""
 *      faqs:
 *        type: array
 *        example: [{"id": 3,"question": "Question 1, Lorem Ipsum is simply dummy text of the printing and typesetting industry.","answer": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries."},{"id": 4,"question": "Question 2, Lorem Ipsum is simply dummy text of the printing and typesetting industry.","answer": "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries."}]
 *      message:
 *         type: string
 *         example: "Request successful"     
 *           
 */

 /**
 * @swagger
 * definitions:
 *   getFAQ:
 *     properties:
 *      statusReason:
 *         type: string
 *         example: "Ok"
 *      data:
 *         $ref: '#/definitions/getFaqsObject'
 *      isSuccessful:
 *         type: boolean
 *         example: true
 *      success:
 *         type: boolean
 *         example: true
 *      statusCode: 
 *         type: integer
 *         example: 200          
 *           
 */

 /**
 * @swagger
 * /faqRead:
 *   post:
 *     tags:
 *       - FAQ API 
 *     description: Fetch faqs list
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         description: Check athenticity of a person
 *         in: header
 *         required: true
 *       - name: user_language
 *         in: header
 *         required: false
 *         type: string
 *     responses:
 *       200:
 *         description: Display FAQs list 
 *         schema:
 *           $ref: '#/definitions/getFAQ'
 */

 /**
 * @swagger
 * definitions:
 *   createFAQrequest:
 *     properties:
 *      id:
 *         type: string
 *         example: "6"
 *      
 *           
 */

 /**
 * @swagger
 * definitions:
 *   createFaqObject:
 *     properties:
 *      code:
 *         type: string
 *         example: "SA00"
 *      status_popupmessage_type:
 *         type: string
 *         example: ""
 *      status_type:
 *         type: string
 *         example: ""
 *      message:
 *         type: string
 *         example: "Request successfully"     
 *           
 */

 /**
 * @swagger
 * definitions:
 *   createFAQresponse:
 *     properties:
 *      statusReason:
 *         type: string
 *         example: "Ok"
 *      data:
 *         $ref: '#/definitions/createFaqObject'
 *      isSuccessful:
 *         type: boolean
 *         example: true
 *      success:
 *         type: boolean
 *         example: true
 *      statusCode: 
 *         type: integer
 *         example: 200          
 *           
 */

 /**
 * @swagger
 * /faqCreate:
 *   post:
 *     tags:
 *       - FAQ API 
 *     description: Create FAQ API
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         description: Check athenticity of a person
 *         in: header
 *         required: true
 *       - name: user_language
 *         in: header
 *         required: false
 *         type: string
 *       - name: Create FAQ
 *         description: Create FAQ
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/createFAQrequest'
 *     responses:
 *       200:
 *         description: Create FAQ  
 *         schema:
 *           $ref: '#/definitions/createFAQresponse'
 */

 /**
 * @swagger
 * definitions:
 *   updateFAQrequest:
 *     properties:
 *      id:
 *         type: string
 *         example: "6"
 *      answer:
 *         type: string
 *         example: "Testing finish"
 *      
 *           
 */

 /**
 * @swagger
 * definitions:
 *   updateFaqObject:
 *     properties:
 *      code:
 *         type: string
 *         example: "SA00"
 *      status_popupmessage_type:
 *         type: string
 *         example: ""
 *      status_type:
 *         type: string
 *         example: ""
 *      message:
 *         type: string
 *         example: "Request successful"     
 *           
 */

 /**
 * @swagger
 * definitions:
 *   updateFAQresponse:
 *     properties:
 *      statusReason:
 *         type: string
 *         example: "Ok"
 *      data:
 *         $ref: '#/definitions/updateFaqObject'
 *      isSuccessful:
 *         type: boolean
 *         example: true
 *      success:
 *         type: boolean
 *         example: true
 *      statusCode: 
 *         type: integer
 *         example: 200          
 *           
 */

 /**
 * @swagger
 * /faqUpdate:
 *   post:
 *     tags:
 *       - FAQ API 
 *     description: Update FAQ API
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         description: Check athenticity of a person
 *         in: header
 *         required: true
 *       - name: user_language
 *         in: header
 *         required: true
 *         type: string
 *       - name: Update FAQ ID
 *         description: Update FAQ ID
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/updateFAQrequest'
 *     responses:
 *       200:
 *         description: Update FAQ based on ID 
 *         schema:
 *           $ref: '#/definitions/updateFAQresponse'
 */

 /**
 * @swagger
 * definitions:
 *   deleteFAQrequest:
 *     properties:
 *      id:
 *         type: string
 *         example: "6"
 *      
 *           
 */

 /**
 * @swagger
 * definitions:
 *   deleteFaqObject:
 *     properties:
 *      code:
 *         type: string
 *         example: "SA03"
 *      status_popupmessage_type:
 *         type: string
 *         example: ""
 *      status_type:
 *         type: string
 *         example: ""
 *      message:
 *         type: string
 *         example: "Request deleted successfully"     
 *           
 */

 /**
 * @swagger
 * definitions:
 *   deleteFAQresponse:
 *     properties:
 *      statusReason:
 *         type: string
 *         example: "Ok"
 *      data:
 *         $ref: '#/definitions/deleteFaqObject'
 *      isSuccessful:
 *         type: boolean
 *         example: true
 *      success:
 *         type: boolean
 *         example: true
 *      statusCode: 
 *         type: integer
 *         example: 200          
 *           
 */

 /**
 * @swagger
 * /faqDelete:
 *   post:
 *     tags:
 *       - FAQ API 
 *     description: Delete FAQ API
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: access_token
 *         description: Check athenticity of a person
 *         in: header
 *         required: true
 *       - name: user_language
 *         in: header
 *         required: false
 *         type: string
 *       - name: Delete FAQ ID
 *         description: Delete FAQ ID
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/deleteFAQrequest'
 *     responses:
 *       200:
 *         description: Delete FAQ based on ID 
 *         schema:
 *           $ref: '#/definitions/deleteFAQresponse'
 */