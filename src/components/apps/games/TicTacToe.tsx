import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { useAudioContext } from '@/components/ui/AudioProvider';

const TicTacToe = () => {
    const [tictactoe, setTictactoe] = useState<(string | null)[]>(new Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [xWins, setXWins] = useState(0); // Track X wins for the session
    const [oWins, setOWins] = useState(0); // Track O wins for the session
    const [gameResult, setGameResult] = useState<string | null>(null); // Track game result for sound effects

    const { playTicTacToeXSound, playTicTacToeOSound, playTicTacToeVictorySound, playTicTacToeDrawSound } = useAudioContext();

    const handleTicTacToeClick = (index: number) => {
        if (tictactoe[index] || checkWinner(tictactoe)) {
            return;
        }

        const currentPlayer = isXNext ? 'X' : 'O';
        const newBoard = [...tictactoe];
        newBoard[index] = currentPlayer;
        setTictactoe(newBoard);
        setIsXNext(!isXNext);

        // Play sound for current player
        if (currentPlayer === 'X') {
            playTicTacToeXSound();
        } else {
            playTicTacToeOSound();
        }

        // Check for winner after move
        const winner = checkWinner(newBoard);
        const isBoardFull = newBoard.every(Boolean);

        if (winner) {
            setGameResult('victory');
            if (winner === 'X') setXWins(prev => prev + 1);
            if (winner === 'O') setOWins(prev => prev + 1);
        } else if (isBoardFull) {
            setGameResult('draw');
        }
    };

    // Play sound effects based on game result
    useEffect(() => {
        if (gameResult === 'victory') {
            // Small delay to let the click sound finish
            setTimeout(() => playTicTacToeVictorySound(), 300);
        } else if (gameResult === 'draw') {
            setTimeout(() => playTicTacToeDrawSound(), 300);
        }
    }, [gameResult, playTicTacToeVictorySound, playTicTacToeDrawSound]);

    const checkWinner = (board: (string | null)[]) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6] // diagonals
        ];

        for (const [a, b, c] of lines) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    };

    const resetTicTacToe = () => {
        setTictactoe(new Array(9).fill(null));
        setIsXNext(true);
        setGameResult(null); // Reset game result
    };

    const getCellColor = (cell: string | null): string => {
        if (cell === 'X') return '#ef4444'; // red-500
        if (cell === 'O') return '#10b981'; // emerald-500 
        return 'inherit';
    };

    return (
        <div className="bg-gray-800 rounded-xl p-8 text-center">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Tic Tac Toe</h2>
                <button
                    onClick={resetTicTacToe}
                    className="flex items-center space-x-2 bg-blue-400 hover:bg-blue-500 px-4 py-2 rounded-lg transition-colors"
                >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset</span>
                </button>
            </div>

            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto mb-6">
                {tictactoe.map((cell, index) => (
                    <button
                        key={`tictactoe-cell-${index}-${cell}`}
                        onClick={() => handleTicTacToeClick(index)}
                        className="aspect-square bg-gray-700 hover:bg-gray-600 rounded-lg text-2xl font-bold transition-colors"
                        style={{
                            color: getCellColor(cell),
                        }}
                    >
                        {cell}
                    </button>
                ))}
            </div>

            <div className="text-center">
                {(() => {
                    const winner = checkWinner(tictactoe);
                    const isBoardFull = tictactoe.every(Boolean);

                    if (winner) {
                        return (
                            <p className="text-green-400 text-lg">
                                🎉 Player <span style={{ color: winner === 'X' ? '#ef4444' : '#10b981' }}>{winner}</span> wins!
                            </p>
                        );
                    }

                    if (isBoardFull) {
                        return <p className="text-yellow-400 text-lg">🤝 It&apos;s a tie!</p>;
                    }

                    return (
                        <p className="text-gray-300">
                            Next player: <span style={{ color: isXNext ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                                {isXNext ? 'X' : 'O'}
                            </span>
                        </p>
                    );
                })()}
                <div className="mt-4 text-gray-400">
                    <p>X Wins: {xWins}</p>
                    <p>O Wins: {oWins}</p>
                </div>
            </div>
        </div>
    );
};

export default TicTacToe;