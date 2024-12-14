    // gameWorker.js
    self.onmessage = function(e) {
        const { grid, GRID_SIZE } = e.data;
        const newGrid = calculateNextGeneration(grid, GRID_SIZE);
        self.postMessage(newGrid);
    };

    function calculateNextGeneration(grid, GRID_SIZE) {
        const newGrid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false));
        
        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                const neighbors = countNeighbors(grid, i, j, GRID_SIZE);
                newGrid[i][j] = grid[i][j] ? 
                    (neighbors === 2 || neighbors === 3) : 
                    (neighbors === 3);
            }
        }
        return newGrid;
    }

    function countNeighbors(grid, x, y, GRID_SIZE) {
        let count = 0;
        const offsets = [
            [-1,-1], [-1,0], [-1,1],
            [0,-1],          [0,1],
            [1,-1],  [1,0],  [1,1]
        ];
        
        for (const [i, j] of offsets) {
            const newX = (x + i + GRID_SIZE) % GRID_SIZE;
            const newY = (y + j + GRID_SIZE) % GRID_SIZE;
            if (grid[newX][newY]) count++;
        }
        return count;
    }