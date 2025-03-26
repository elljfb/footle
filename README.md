# Football Player Guessing Game

A daily football player guessing game inspired by Wordle. Try to guess the mystery football player in 5 attempts or less!

## Features

- New player to guess every day
- Feedback on each guess with color-coded hints
- Compare attributes like position, age, nationality, club, and more
- Modern and responsive design

## How to Play

1. Type the name of a football player and press Enter or click the Guess button
2. The game will provide feedback on your guess:
   - 🟩 Green: Exact match
   - 🟨 Orange: Close but not exact
   - ⬜ Gray: No match
3. Use the feedback to make better guesses
4. Try to guess the player in 5 attempts or less!

## Attributes Compared

- Position: General playing position (e.g., Defender, Midfielder)
- Sub-Position: Specific role (e.g., Left-Back, Attacking Midfielder)
- Age: Player's current age
- Nationality: Player's nationality
- Club: Current club
- League: Current domestic league
- Height: Height in centimeters
- Foot: Preferred foot (Left/Right/Both)

## Development

### Prerequisites

- Node.js 16.8 or later
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/football-guess.git
cd football-guess
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
# or
yarn build
```

## Technologies Used

- Next.js 13+
- React 18
- TypeScript
- Tailwind CSS

## Contributing

Feel free to submit issues and enhancement requests! 