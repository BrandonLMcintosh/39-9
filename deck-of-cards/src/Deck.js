import {React, useState, useEffect, useRef} from "react";
import Card from "./Card";
import "./Deck.css";
import axios from "axios";

const BASE_URL = "http://deckofcardsapi.com/api/deck";

const Deck = () => {
    const INITIAL_STATE = [];
    const [drawnCards, setDrawnCards] = useState(INITIAL_STATE);
    const [autoDraw, setAutoDraw] = useState(false);
    const [deck, setDeck] = useState(null);
    const timerRef = useRef(null);

    useEffect(() => {
        const fetchDeck = async () => {
            axios.get(`${BASE_URL}/new/shuffle/`)
            .then(res => setDeck(res.data)).catch(err => alert(err));
        };
        await fetchDeck();
    }, [setDeck])
    
    useEffect(() => {
        const fetchCard = async () => {
            try {
                let res = await axios.get(`${BASE_URL}/${deck.deck_id}/draw/`);
                if (res.data.remaining === 0) {
                    setAutoDraw(false);
                    throw new Error('out of cards');
                }

                const card = res.data.cards[0];

                setDrawnCards(drawn => [...drawn, {
                    id: card.code,
                    name: card.suite + " " + card.value,
                    image: card.image
                }]);
            } catch (err) {
                alert(err);
            }
        };
        
        if (autoDraw && !timerRef.current) {
            timerRef.current = setInterval(async () => {
                await getCard();
            }, 1000);
        }

        return () => {
            clearInterval(timerRef.current);
            timerRef.current = null;
        };
    }, [autoDraw, setAutoDraw, deck]);

    const toggleAutoDraw = () => {
        setAutoDraw(auto => !auto);
    }

    const cards = drawnCards.map(card => (
        <Card key={card.id} name={card.name} image={card.image} />
    ));

    return (
        <div>

            <div className="Deck">
                {deck ? (
                    <button className="Deck-draw" onClick={toggleAutoDraw}>
                        {autoDraw ? "STOP" : "CONTINUE"}
                    </button>
                ) : null}
                <div className="Deck-cards">{cards}</div>
            </div>
        </div>
        
    )
}

export default Deck;