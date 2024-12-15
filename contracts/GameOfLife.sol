// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract GameOfLife {
    // 游戏费用
    uint256 public constant START_GAME_FEE = 0.0005 ether;
    uint256 public constant SAVE_PATTERN_FEE = 0.001 ether;
    
    // 游戏数据结构
    struct Pattern {
        address creator;
        string ipfsHash;
        uint256 timestamp;
        bool exists;
    }
    
    // 存储所有保存的模式
    mapping(bytes32 => Pattern) public patterns;
    
    // 用户的模式列表
    mapping(address => string[]) public userPatterns;
    
    // 记录用户的游戏次数
    mapping(address => uint256) public gamesPlayed;
    
    // 事件声明
    event GameStarted(address indexed player, uint256 timestamp);
    event PatternSaved(address indexed creator, string ipfsHash, bytes32 patternId);
    
    // 合约拥有者
    address public owner;
    
    constructor() {
        owner = msg.sender;
    }
    
    // 修饰器：检查支付的费用
    modifier checkFee(uint256 fee) {
        require(msg.value >= fee, "Insufficient payment");
        _;
    }
    
    // 开始游戏
    function startGame() external payable checkFee(START_GAME_FEE) {
        // 增加用户游戏次数
        gamesPlayed[msg.sender]++;
        
        // 触发游戏开始事件
        emit GameStarted(msg.sender, block.timestamp);
    }
    
    // 保存模式
    function savePattern(string calldata ipfsHash) 
        external 
        payable 
        checkFee(SAVE_PATTERN_FEE) 
    {
        // 生成唯一的模式ID
        bytes32 patternId = keccak256(
            abi.encodePacked(msg.sender, ipfsHash, block.timestamp)
        );
        
        // 确保模式ID不重复
        require(!patterns[patternId].exists, "Pattern already exists");
        
        // 保存模式数据
        patterns[patternId] = Pattern({
            creator: msg.sender,
            ipfsHash: ipfsHash,
            timestamp: block.timestamp,
            exists: true
        });
        
        userPatterns[msg.sender].push(ipfsHash);
        
        // 触发保存事件
        emit PatternSaved(msg.sender, ipfsHash, patternId);
    }
    
    // 获取用户的游戏统计
    function getPlayerStats(address player) 
        external 
        view 
        returns (uint256 totalGames) 
    {
        return gamesPlayed[player];
    }
    
    // 提取合约中的资金
    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
    
    // 获取用户的模式列表
    function getUserPatterns(address user) 
        external 
        view 
        returns (string[] memory) 
    {
        return userPatterns[user];
    }
} 