import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  FlatList,
  Alert
} from 'react-native';

const checkWin = game => {
  // Horizontal win conditions
  if (game[0] !== '' && game[0] === game[1] && game[0] === game[2])
    return game[0];
  if (game[3] !== '' && game[3] === game[4] && game[3] === game[5])
    return game[3];
  if (game[6] !== '' && game[6] === game[7] && game[6] === game[8])
    return game[6];

  // Vertical win conditions
  if (game[0] !== '' && game[0] === game[3] && game[0] === game[6])
    return game[0];
  if (game[1] !== '' && game[1] === game[4] && game[1] === game[7])
    return game[1];
  if (game[2] !== '' && game[2] === game[5] && game[2] === game[8])
    return game[2];

  // Diagonal win conditions
  if (game[0] !== '' && game[0] === game[4] && game[0] === game[8])
    return game[0];
  if (game[2] !== '' && game[2] === game[4] && game[2] === game[6])
    return game[2];

  if (checkFilled(game)) return 'draw';

  // If no winner, return null
  return null;
};

function checkFilled(game) {
  return !game.flat().some(val => val === '');
}

function PlayerTurnComponent({ value, winner }) {
  return (
    <View
      style={{
        width: '100%',
        backgroundColor: value?.toLowerCase() === 'x' ? '#347856' : '#345678',
        padding: 12,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 3,
      }}>
      <Text
        style={{
          color: '#eee',
          fontSize: 18,
        }}>
        {winner
          ? winner === 'draw'
            ? 'Draw hi hua hai, zyada khush hone ki zarurat nahi hai'
            : 'Player ' + winner?.toUpperCase() + ' jeet gaya'
          : 'Player ' + value?.toUpperCase() + ' ki baari'}
      </Text>
    </View>
  );
}

function WinComponent({ player, wins }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#444',
        padding: 12,
        alignItems: 'center',
        borderRadius: 3,
      }}>
      <Text
        style={{
          color: '#eee',
        }}>
        {player?.toUpperCase()} total wins : {wins}
      </Text>
    </View>
  );
}

function ErrorMsg({ errorMsg }) {
  return (
    <View
      style={{
        width: '100%',
        backgroundColor: 'red',
        padding: 12,
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: '#fff',
          fontWeight: '600',
        }}>
        {errorMsg}
      </Text>
    </View>
  );
}

function ReloadButton({ setErrorMsg, setTurn, setGame, setWinner }) {
  // get random between 0 or 1
  const random = Math.round(Math.random());

  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        width: '100%',
        padding: 14,
        backgroundColor: '#433475',
        borderRadius: 10,
        elevation: 15,
      }}
      activeOpacity={0.5}
      onPress={() => {
        setTurn(random == 1 ? 'x' : 'o');
        setErrorMsg('');
        setGame(Array(9).fill(''));
        setWinner('');
      }}>
      <Text
        style={{
          color: '#eee',
          fontSize: 15,
        }}>
        Reload
      </Text>
    </TouchableOpacity>
  );
}

function GameBox({
  turn,
  setTurn,
  game,
  setGame,
  setWinner,
  winner,
  wins,
  setWins,
}) {
  const screenWidth = Dimensions.get('window').width;
  const data = Array.from({ length: 9 }, (_, index) => ({
    key: index.toString(),
  }));

  const renderItem = ({ index }) => (
    <TouchableOpacity
      style={{
        height: (screenWidth - 36) / 3,
        width: (screenWidth - 36) / 3,
        backgroundColor: game[index]?.length > 0 ? '#2228' : '#111c',
        margin: 1.5,
        alignItems: 'center',
        justifyContent: 'center',
      }}
      activeOpacity={0.6}
      onPress={() => {
        if (game[index]?.length > 0 || winner) return;
        const updatedGame = [...game];
        updatedGame[index] = turn?.toLowerCase();
        setGame(updatedGame);
        const result = checkWin(updatedGame);
        if (result) {
          setWinner(result);
          if (result !== 'draw') {
            setWins(prevWins => ({ ...prevWins, [result]: prevWins[result] + 1 }));
            Alert.alert('Game End', result?.toUpperCase() + ' jeet gya')
          } else {
            Alert.alert('Draw', 'Draw ho gya, dhang se khelo')
          }
          return;
        }
        setTurn(turn?.toLowerCase() === 'x' ? 'o' : 'x');
      }}
      disabled={game[index]?.length > 0 || winner ? true : false}
      accessibilityLabel={`Cell ${index}`} // Accessibility label for screen readers
    >
      <Text
        style={{
          color: game[index]?.toLowerCase() === 'x' ? '#2a4' : '#78e',
          fontSize: 45,
        }}>
        {game[index]?.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
        }}>
        <FlatList
          data={data}
          renderItem={renderItem}
          numColumns={3}
          keyExtractor={item => item.key}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{
            backgroundColor: '#87e5',
          }}
        />
      </View>
    </View>
  );
}

export default function App() {
  const [turn, setTurn] = useState('x');
  const [wins, setWins] = useState({ x: 0, o: 0 });
  const [winner, setWinner] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [game, setGame] = useState(Array(9).fill(''));

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#111',
      }}>
      <StatusBar barStyle="light-content" backgroundColor="#111" />
      <View
        style={{
          flex: 1,
          padding: 12,
          gap: 12,
        }}>
        <PlayerTurnComponent value={turn} winner={winner} />
        <View
          style={{
            flexDirection: 'row',
            gap: 12,
          }}>
          <WinComponent player="x" wins={wins.x} />
          <WinComponent player="o" wins={wins.o} />
        </View>
        <GameBox
          {...{ turn, setTurn, game, setGame, setWinner, winner, setWins, wins }}
        />
        <ReloadButton {...{ setErrorMsg, setTurn, setGame, setWinner }} />
      </View>
      {errorMsg && <ErrorMsg errorMsg={errorMsg} />}
    </SafeAreaView>
  );
}
