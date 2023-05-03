
/* `pragma solidity ^0.8.0;` is a compiler directive that specifies the version of the Solidity
programming language that the contract is written in. In this case, it specifies that the contract
is written in Solidity version 0.8.0 or higher. The caret symbol (^) indicates that the contract can
also be compiled with any compatible minor or patch version of Solidity that is greater than or
equal to 0.8.0, but less than 0.9.0. */

//SPDX-License-Identifier: Unlicense
pragma solidity ^ 0.8.0;

//interface for ERC721
/* The `interface IERC721` is defining a set of functions that a contract must implement in order to be
considered an ERC721 compliant contract. The `function transferFrom` is one of the functions that
must be implemented, and it is used to transfer the ownership of an NFT (non-fungible token) from
one address to another. By defining this function in the interface, other contracts can interact
with the ERC721 contract using this function without needing to know the implementation details of
the contract. */
interface IERC721 {
    function transferFrom(
    /* `address _from`, `address _to`, and `uint256 _id` are parameters of the `transferFrom`
    function in the `IERC721` interface. They represent the address of the current owner of the
    NFT (`_from`), the address of the new owner of the NFT (`_to`), and the unique identifier of
    the NFT (`_id`), respectively. This function is used to transfer the ownership of an NFT from
    one address to another. */
    address _from,
    address _to,
    uint256 _id
) external;
}

contract Escrow {

/* These are state variables declared in the contract that store the addresses of the NFT contract
(`nftAddress`), the seller (`seller`), the inspector (`inspector`), and the lender (`lender`). They
are declared as `public`, which means that they can be accessed and read by anyone. `seller` is
declared as `payable`, which means that it can receive Ether (the native cryptocurrency of the
Ethereum blockchain). These variables are initialized in the constructor of the contract. */
address public nftAddress; 
address payable public seller;
address public inspector; 
address public lender;

/* This is a modifier that checks if the caller of a function is the buyer of a specific NFT
(non-fungible token) identified by its ID. It requires that the `msg.sender` (the caller) is equal
to the `buyer[_nftID]` (the address of the buyer of the NFT with ID `_nftID`). If the condition is
true, the function that uses this modifier will be executed, otherwise, it will revert with the
error message "Only buyer can call this method". The underscore `_` indicates where the function
code will be inserted when the modifier is used. */

modifier onlyBuyer(uint256 _nftID) {
        require(msg.sender == buyer[_nftID], "Only buyer can call this method");
        _;
    }

/* The `onlySeller` modifier is used to restrict access to a function to only the seller of the NFT
being traded. It checks if the caller of the function is the same as the `seller` address stored in
the contract state variable. If the condition is true, the function that uses this modifier will be
executed, otherwise, it will revert with the error message "Only seller can call this method". The
underscore `_` indicates where the function code will be inserted when the modifier is used. */

    modifier onlySeller() {
        require(msg.sender == seller, "Only seller can call this method");
        _;
    }
/* The `onlyInspector` modifier is used to restrict access to a function to only the inspector of the
NFT being traded. It checks if the caller of the function is the same as the `inspector` address
stored in the contract state variable. If the condition is true, the function that uses this
modifier will be executed, otherwise, it will revert with the error message "Only inspector can call
this method". The underscore `_` indicates where the function code will be inserted when the
modifier is used. */

    modifier onlyInspector() {
        require(msg.sender == inspector, "Only inspector can call this method");
        _;
    }


    /* `mapping(uint256 => bool) public isListed;` is declaring a public mapping variable named `isListed`
    that maps a `uint256` key (representing the ID of a non-fungible token) to a boolean value. This
    mapping is used to keep track of whether a specific NFT has been listed for sale or not. If the
    value of `isListed[_nftID]` is `true`, it means that the NFT with ID `_nftID` has been listed for
    sale, and if it is `false`, it means that it has not been listed. The `public` keyword makes the
    mapping variable accessible and readable by anyone. */
    mapping(uint256 => bool) public isListed;  //mapping variable

    /* `mapping(uint256 => uint256) public purchasePrice;` is declaring a public mapping variable named
    `purchasePrice` that maps a `uint256` key (representing the ID of a non-fungible token) to a
    `uint256` value (representing the purchase price of the NFT). This mapping is used to keep track of
    the purchase price of each NFT that is listed for sale. The `public` keyword makes the mapping
    variable accessible and readable by anyone. */
    mapping(uint256 => uint256) public purchasePrice;

    /* `mapping(uint256 => uint256) public escrowAmount;` is declaring a public mapping variable named
    `escrowAmount` that maps a `uint256` key (representing the ID of a non-fungible token) to a
    `uint256` value (representing the amount of Ether that the buyer needs to deposit as earnest money
    for the NFT purchase). This mapping is used to keep track of the required earnest money for each NFT
    that is listed for sale. The `public` keyword makes the mapping variable accessible and readable by
    anyone. */
    mapping(uint256 => uint256) public escrowAmount;

    /* `mapping(uint256 => address) public buyer;` is declaring a public mapping variable named `buyer`
    that maps a `uint256` key (representing the ID of a non-fungible token) to an `address` value
    (representing the address of the buyer of the NFT). This mapping is used to keep track of the buyer
    of ea ch NFT that is listed for sale. The `public` keyword makes the mapping variable accessible and
    readable by anyone. */
    mapping(uint256 => address) public buyer;

    /* `mapping (uint256 => bool) public inspectionPassed;` is declaring a public mapping variable named
    `inspectionPassed` that maps a `uint256` key (representing the ID of a non-fungible token) to a
    boolean value. This mapping is used to keep track of the inspection status of each NFT that is
    listed for sale. If the value of `inspectionPassed[_nftID]` is `true`, it means that the NFT with ID
    `_nftID` has passed the inspection, and if it is `false`, it means that it has failed the
    inspection. The `public` keyword makes the mapping variable accessible and readable by anyone. */
    mapping(uint256 => bool) public inspectionPassed;


    /* `mapping(uint256 => mapping(address => bool)) public approval;` is declaring a public mapping
    variable named `approval` that maps a `uint256` key (representing the ID of a non-fungible token) to
    another mapping that maps an `address` key (representing the address of a user) to a boolean value.
    This mapping is used to keep track of whether a specific user has approved the sale of a specific
    NFT or not. If the value of `approval[_nftID][_userAddress]` is `true`, it means that the user with
    address `_userAddress` has approved the sale of the NFT with ID `_nftID`, and if it is `false`, it
    means that they have not approved it. The `public` keyword makes the mapping variable accessible and
    readable by anyone. */
    mapping(uint256 => mapping(address => bool)) public approval;

    constructor(
        /* These are parameters of the constructor function of the Escrow contract. They are used to
        initialize the state variables `nftAddress`, `seller`, `inspector`, and `lender` with the values
        passed in when the contract is deployed. */
        address _nftAddress,
        address payable _seller,
        address _inspector,
        address _lender
    ){
        /* These lines of code are initializing the state variables `nftAddress`, `seller`, `inspector`,
        and `lender` with the values passed in as parameters when the Escrow contract is deployed.
        `nftAddress` is set to `_nftAddress`, `seller` is set to `_seller`, `inspector` is set to
        `_inspector`, and `lender` is set to `_lender`. These variables are declared as state variables
        at the beginning of the contract and are used throughout the contract to store and access
        information related to the NFT trade being conducted. */
        nftAddress = _nftAddress;
        seller = _seller;
        inspector = _inspector;
        lender = _lender;
    }
    /* The `list` function is a public function that allows the seller to list an NFT for sale on the
    Escrow contract. It takes four parameters: `_nftID` (a `uint256` representing the ID of the NFT
    being listed), `_buyer` (an `address` representing the address of the buyer who will purchase the
    NFT), `_purchaseAmount` (a `uint256` representing the purchase price of the NFT), and
    `_escrowAmount` (a `uint256` representing the amount of Ether that the buyer needs to deposit as
    earnest money for the NFT purchase). */


    //Seller list property for sale
    function list(
        uint256 _nftID,
        address _buyer,
        uint256 _purchaseAmount,
        uint256 _escrowAmount
    ) public payable onlySeller{
        //Transfer nft from seller to this contract 
        /* This line of code is calling the `transferFrom` function of the ERC721 contract at the address
        `nftAddress`. It is transferring the ownership of the NFT with ID `_nftID` from the `msg.sender`
        (the seller) to the address of the Escrow contract (`address(this)`), effectively putting the NFT
        under the control of the Escrow contract until the conditions of the trade are met. */
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);

        /* These lines of code are setting the values of the mapping variables `isListed`,
        `purchasePrice`, `escrowAmount`, and `buyer` for a specific NFT with ID `_nftID`. */
        isListed[_nftID] = true;
        purchasePrice[_nftID] = _purchaseAmount;
        escrowAmount[_nftID] = _escrowAmount;
        buyer[_nftID] = _buyer;
    }

    //Put under contract (only buyer - payable escrow)
    /**
     * This function allows a buyer to deposit the required earnest money for a specific NFT purchase.
     * @param _nftID - _nftID is a parameter of type uint256, which represents the unique identifier of a
     * non-fungible token (NFT) that the buyer wants to deposit earnest money for.
     */
    function depositEarnest(uint256 _nftID) public payable onlyBuyer(_nftID){
        require(msg.value >= escrowAmount[_nftID]);
    }

    //update inspection status (only buyer)
    /*
     * This function updates the inspection status of an NFT with a given ID based on whether it passed or
     * not, and can only be called by an inspector.
     * @param uint256 - uint256 is a data type in Solidity that represents an unsigned integer of 256 bits.
     * It can hold values from 0 to 2^256-1.
     * @param _passed - _passed is a boolean variable that represents the status of an inspection. If it is
     * set to true, it means that the inspection has passed, and if it is set to false, it means that the
     * inspection has failed. This variable is used as a parameter in the function updateInspectionStatus,
    
     */
    function updateInspectionStatus(uint256 _nftID, bool _passed) public onlyInspector{
        inspectionPassed[_nftID] = _passed;
    }

    /*
     * The function "approvedSale" approves the sale of a specific NFT by setting the approval status to
     * true for the sender.
     * @param uint256 - uint256 is a data type in Solidity, which represents an unsigned integer of 256
     * bits (32 bytes). It can hold values from 0 to 2^256-1. In this function, it is used as a parameter
     * to identify the unique ID of an NFT (non-f
     */
    //Approve sale 
    function approvedSale(uint256 _nftID) public {
        approval[_nftID][msg.sender] = true;
    }


    //FINALIZE SALE
    function finalizeSale(uint256 _nftID) public{

        /* The above code is a series of `require` statements in JavaScript. It is checking for certain
        conditions to be true before allowing the execution of the rest of the code. */
        require(inspectionPassed[_nftID]);
        require(approval[_nftID][buyer[_nftID]]);
        require(approval[_nftID][seller]);
        require(approval[_nftID][lender]);
        require(address(this).balance >= purchasePrice[_nftID]);

        /* The above code is setting the value of the variable `isListed` at the index `_nftID` to
        `false`. It is likely part of a larger program that involves tracking whether
         certain
        non-fungible tokens (NFTs) are listed for sale or not. */
        isListed[_nftID] = false; //NFTs are not listed for sale

      /* The above code is sending the balance of the current contract to the
       address of the seller and
      it is using the `payable` function to make the transfer. 
      The `call` function is used to
      execute the transfer and it returns a boolean value indicating whether 
      the transfer was
      successful or not. 
      The `require` statement is used to ensure that the transfer was successful,
      and it will revert the transaction if the transfer fails. */
        (bool success, ) = payable(seller).call{ value: address(this).balance } ("");
        require(success);

        /* The above code is calling the `transferFrom` function of the `IERC721` contract, passing in
        the address of the NFT contract (`nftAddress`), the current contract's address
        (`address(this)`) as the sender, the address of the buyer (`buyer[_nftID]`) as the
        recipient, and the ID of the NFT (`_nftID`) to be transferred.
         This code is likely part of a
        smart contract that facilitates the transfer of an NFT from the
         contract to a buyer. */
        IERC721(nftAddress).transferFrom(address(this), buyer[_nftID], _nftID);
    }

    /*
     * This function cancels a sale and transfers the balance to either the buyer or seller depending on
     * whether the inspection has passed or not.
     * @param uint256 - uint256 is a data type in Solidity that represents an unsigned integer of 256 bits
     * (32 bytes). It can hold values from 0 to 2^256-1. In this function, it is used to represent the
     * unique identifier of an NFT (non-fungible token)
     */

    //Cancel sale (handle earnest deposit).
    // -if inspection status is not approved, refund, otherwise send to seller   
    function cancelSale(uint256 _nftID) public {
        if (inspectionPassed[_nftID] == true) {
            payable(buyer[_nftID]).transfer(address(this).balance);
        } else {
            payable(seller).transfer(address(this).balance);
        }
    }

    receive() external payable { }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
