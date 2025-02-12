// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Turing is ERC20 {
    event VoteEvent(string name);

    struct User {
        address addr;
        string name;
        uint index;
        uint256 mask;
    }

    address public deployer;
    bool public voting = true;

    uint currentUserIndex = 0;
    mapping(string => User) mapAuthorizedUsers;
    mapping(address => User) mapAuthorizedUsersAddr;
    string[] usersList;

    mapping(address => uint256) balances;

    constructor() ERC20("Turing", "TUR") {
        deployer = msg.sender;

        addAuthorizedUser("nome1", 0x70997970C51812dc3A010C7d01b50e0d17dc79C8);
        addAuthorizedUser("nome2", 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC);
        addAuthorizedUser("nome3", 0x90F79bf6EB2c4f870365E785982E1f101E93b906);
        addAuthorizedUser("nome4", 0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65);
        addAuthorizedUser("nome5", 0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc);
        addAuthorizedUser("nome6", 0x976EA74026E726554dB657fA54763abd0C3a0aa9);
        addAuthorizedUser("nome7", 0x14dC79964da2C08b23698B3D3cc7Ca32193d9955);
        addAuthorizedUser("nome8", 0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f);
        addAuthorizedUser("nome9", 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720);
        addAuthorizedUser("nome10", 0xBcd4042DE499D14e55001CcbB24a551F3b954096);
        addAuthorizedUser("nome11", 0x71bE63f3384f5fb98995898A86B02Fb2426c5788);
        addAuthorizedUser("nome12", 0xFABB0ac9d68B0B445fB7357272Ff202C5651694a);
        addAuthorizedUser("nome13", 0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec);
        addAuthorizedUser("nome14", 0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097);
        addAuthorizedUser("nome15", 0xcd3B766CCDd6AE721141F452C550Ca635964ce71);
        addAuthorizedUser("nome16", 0x2546BcD3c84621e976D8185a91A922aE77ECEc30);
        addAuthorizedUser("nome17", 0xbDA5747bFD65F08deb54cb465eB87D40e51B197E);
        addAuthorizedUser("nome18", 0xdD2FD4581271e230360230F9337D5c0430Bf44C0);
        addAuthorizedUser("nome19", 0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199);
    }

    function getUsersList() public view returns (string[] memory) {
        return usersList;
    }

    function getBalance(string memory name) public view returns (uint256) {
        return balances[mapAuthorizedUsers[name].addr];
    }

    function addAuthorizedUser(string memory name, address addr) internal {
        mapAuthorizedUsers[name] = User(addr, name, currentUserIndex, 0);
        mapAuthorizedUsersAddr[addr] = User(addr, name, currentUserIndex, 0);
        currentUserIndex += 1;
        usersList.push(name);
    }

    function issueToken(
        string memory name,
        uint256 amount
    ) public ownerOrAuthorized {
        require(
            mapAuthorizedUsers[name].addr != address(0),
            "Account not found."
        );

        _mint(mapAuthorizedUsers[name].addr, amount * 10 ** 17);

        balances[mapAuthorizedUsers[name].addr] += amount;

        emit VoteEvent(name);
    }

    function vote(string memory name, uint256 amount) public votingOnModifier {
        require(
            mapAuthorizedUsers[name].addr != address(0),
            "Voted used not found."
        );

        require(
            mapAuthorizedUsersAddr[msg.sender].addr != address(0),
            "Only authorized users can vote."
        );

        require(
            amount * 10 ** 17 < 2000000000000000001,
            "Amount exceeds the maximum value (2 TUR)"
        );

        require(
            msg.sender != mapAuthorizedUsers[name].addr,
            "A user can't vote for itself."
        );

        require(
            mapAuthorizedUsersAddr[msg.sender].mask == 0 ||
                mapAuthorizedUsersAddr[msg.sender].mask &
                    (0x1 << mapAuthorizedUsers[name].index) ==
                0,
            "A user can't vote more than once in other user."
        );

        mapAuthorizedUsersAddr[msg.sender].mask |= (0x1 <<
            mapAuthorizedUsers[name].index);

        _mint(mapAuthorizedUsers[name].addr, amount * 10 ** 17);
        _mint(msg.sender, 200000000000000000);

        balances[mapAuthorizedUsers[name].addr] += amount;
        balances[msg.sender] += 2;

        emit VoteEvent(name);
        emit VoteEvent(mapAuthorizedUsersAddr[msg.sender].name);
    }

    function votingOn() public ownerOrAuthorized {
        voting = true;
    }

    function votingOff() public ownerOrAuthorized {
        voting = false;
    }

    modifier votingOnModifier() {
        require(voting == true, "Voting is not enable.");
        _;
    }

    modifier ownerOrAuthorized() {
        require(
            msg.sender == deployer ||
                msg.sender == 0x502542668aF09fa7aea52174b9965A7799343Df7,
            "Method can only be called by the owner or other authorized users."
        );
        _;
    }
}
