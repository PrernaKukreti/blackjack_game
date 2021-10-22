describe("Blackjack Game Unit Testing ", function () {
    function creatingHTMLElements() {
        document.body.innerHTML = '<div id="dealer-stand" class="stood" >Hello</div> <div id="dealer-points" >Hello</div>' +
            '<div id="dealer-cards" >Hello</div> <span id="player-stand"  class="stood">Hello</span>' +
            '<div id="player-points" >Hello</div><div id="player-cards" >Hello</div>' + '<div id="deal-first" class="stood" >' +
            '<div id="play-control" class="started" ><input type="button" id="blackjack-start" value="Play!"/>' +
            '<input type="button" id="blackjack-hit" value="Play!"/>' + '<input type="button" id="blackjack-stand" value="Play!"/></div'
        blackjack.dealerStand = document.getElementById('dealer-stand');
        blackjack.playerStand = document.getElementById('player-stand');
        blackjack.dealerHand = document.getElementById('dealer-cards');
        blackjack.dealerPoints = document.getElementById('dealer-points')
        blackjack.playerPoints = document.getElementById('player-points')
        blackjack.playerHand = document.getElementById('player-cards');
        blackjack.hpcon = document.getElementById("play-control");
    }
    describe("On initializingGame method", function () {
        beforeEach(function () {
            document.body.innerHTML = '<div id="dealer-stand" >Hello</div> <div id="dealer-points" >Hello</div>' +
                '<div id="dealer-cards" >Hello</div> <span id="player-stand" >Hello</span>' +
                '<div id="player-points" >Hello</div><div id="player-cards" >Hello</div>' +
                '<div id="play-controls" >Hello</div><input type="button" id="blackjack-start" value="Play!"/>' +
                '<input type="button" id="blackjack-hit" value="Play!"/>' + '<input type="button" id="blackjack-stand" value="Play!"/>'
        })
        it("Should create the HTML elements for the blackjack game", function () {
            const dealStandElement = document.getElementById('dealer-stand');
            const dealPointsElement = document.getElementById('dealer-points');
            const dealCardsElement = document.getElementById('dealer-cards');
            const playStandElement = document.getElementById('player-stand');
            const playPointsElement = document.getElementById('player-points');
            const playCardsElement = document.getElementById('player-cards');
            initializingGame();
            expect(blackjack.dealerStand).toBe(dealStandElement);
            expect(blackjack.dealerPoints).toBe(dealPointsElement);
            expect(blackjack.dealerHand).toBe(dealCardsElement)
            expect(blackjack.playerStand).toBe(playStandElement);
            expect(blackjack.playerPoints).toBe(playPointsElement);
            expect(blackjack.playerHand).toBe(playCardsElement);
        });
    });
    describe("On startBlackjack method", function () {
        beforeEach(function () {
            creatingHTMLElements();
        })
        it("Should able to draw card when blackjack game is started", function () {
            expect(blackjack.deck.length).toBe(0);
            startBlackjack();
            expect(blackjack.dealerHand.classList).not.toContain('stood');
            expect(blackjack.playerHand.classList).not.toContain('stood');
            expect(blackjack.hpcon.classList).toContain('started');
            expect(blackjack.deck.length).toBe(48);
            expect(blackjack.turn).toBe(0);
        });
        it("Should assign turn to be one when winner/lose is assigned", function () {
            spyOn(game, "calculatePoints").and.callFake(function () {
                blackjack.playerCurrentPoints = 25;
            });
            startBlackjack();
            expect(blackjack.turn).toBe(1);
        });
        it("Should show alert with message when the game result is tie", function () {
            spyOn(window, 'alert');
            spyOn(game, "calculatePoints").and.callFake(function () {
                blackjack.playerCurrentPoints = 21;
                blackjack.dealerCurrentPoints = 21
            });
            startBlackjack();
            expect(blackjack.turn).toBe(1);
            expect(window.alert).toHaveBeenCalledWith("It's a tie with Blackjacks");

        });
        it("Should show alert with message when the game when player wins the game at initial draw", function () {
            spyOn(window, 'alert');
            spyOn(game, "calculatePoints").and.callFake(function () {
                blackjack.playerCurrentPoints = 21;
            });
            startBlackjack();
            expect(blackjack.turn).toBe(1);
            expect(window.alert).toHaveBeenCalledWith("Player wins with a Blackjack!");

        });
        it("Should show alert with message when the game when dealer wins the game at initial draw", function () {
            spyOn(window, 'alert');
            spyOn(game, "calculatePoints").and.callFake(function () {
                blackjack.dealerCurrentPoints = 21
            });
            startBlackjack();
            expect(blackjack.turn).toBe(1);
            expect(window.alert).toHaveBeenCalledWith("Dealer wins with a Blackjack!");

        });
        it("Should show alert with message when the game when player wins the game when new card is hit ", function () {
            spyOn(window, 'alert');
            spyOn(game, "calculatePoints").and.callFake(function () {
                blackjack.dealerCurrentPoints = 25;
            });
            startBlackjack();
            expect(blackjack.turn).toBe(1);
            expect(window.alert).toHaveBeenCalledWith("Dealer has gone bust - Player wins!");
        });
        it("Should show alert with message when the game when dealer wins the game when new card is hit ", function () {
            spyOn(window, 'alert');
            spyOn(game, "calculatePoints").and.callFake(function () {
                blackjack.playerCurrentPoints = 25;
            });
            startBlackjack();
            expect(window.alert).toHaveBeenCalledWith("Player has gone bust - Dealer wins!");
        });
    });

    describe("On hitAnthorCard method", function () {
        beforeEach(function () {
            creatingHTMLElements();
            startBlackjack();
        })
        it("Should be able assign blackjack.dstand to be true when dealerCurrentPoints is 21", function () {
            spyOn(game, "calculatePoints").and.callFake(function () {
                blackjack.playerCurrentPoints = 21;
                blackjack.dealerCurrentPoints = 25
            });
            spyOn(game, "drawCard").and.callFake(function () {
                blackjack.deck = [{
                    s: 1,
                    n: 8
                }]
            });
            hitAnotherDraw();
            spyOn(game, "check").and.returnValue(null)
            expect(blackjack.pstand).toBe(true);
        });
        it("Should show alert with message when the game when dealer when both players stand ", function () {
            spyOn(window, 'alert');
            spyOn(game, "calculatePoints").and.callFake(function () {
                blackjack.playerCurrentPoints = 18;
                blackjack.dealerCurrentPoints = 21;
            });
            blackjack.pstand = true;
            blackjack.dstand = true;
            hitAnotherDraw();
            expect(window.alert).toHaveBeenCalledWith("Dealer wins with 21 points!");
        });
        it("Should show alert with message when the game when player when both players stand ", function () {
            spyOn(window, 'alert');
            spyOn(game, "calculatePoints").and.callFake(function () {
                blackjack.playerCurrentPoints = 21;
                blackjack.dealerCurrentPoints = 18;
            });
            blackjack.pstand = true;
            blackjack.dstand = true;
            hitAnotherDraw();
            expect(window.alert).toHaveBeenCalledWith("Player wins with 21 points!");
        });
        it("Should show alert with message when the game is tie both players stand ", function () {
            spyOn(window, 'alert');
            spyOn(game, "calculatePoints").and.callFake(function () {
                blackjack.playerCurrentPoints = 21;
                blackjack.dealerCurrentPoints = 21;
            });
            blackjack.pstand = true;
            blackjack.dstand = true;
            hitAnotherDraw();
            expect(window.alert).toHaveBeenCalledWith("It's a tie.");
        });
        it("Should show alert with message when the game is tie both players stand ", function () {
            spyOn(game, "calculatePoints").and.callFake(function () {
                blackjack.dealerCurrentPoints = 21;
            });
            blackjack.turn = 1;
            blackjack.dstand = false;
            hitAnotherDraw();
            expect(blackjack.dstand).toBe(true);
        });
    });

    describe("On stand method", function () {
        beforeEach(function () {
            creatingHTMLElements();
        })
        it("Should be able assign blackjack.dstand to be true when blackjack.turn equals to 1", function () {
            spyOn(game, "drawCard").and.callFake(function () {
                blackjack.deck = [{
                    s: 1,
                    n: 0
                }]
            });
            blackjack.turn = 1;
            stand();
            expect(blackjack.dstand).toBe(true);
        });
        it("Should be able assign blackjack.pstand to be true when blackjack.turn equals to 0", function () {
            spyOn(game, "drawCard").and.callFake(function () {
                blackjack.deck = [{
                    s: 1,
                    n: 0
                }]
            });
            blackjack.turn = 0;
            stand();
            expect(blackjack.pstand).toBe(true);
        });
    });

    describe("On nextTurn method", function () {
        beforeEach(function () {
            creatingHTMLElements();
            startBlackjack();
        })
        it("Should be able assign blackjack.turn to be 0 when dealerCurrentPoints is 22", function () {
            blackjack.dstand = true;
            spyOn(game, "calculatePoints").and.callFake(function () {
                blackjack.dealerCurrentPoints = 22;
            });
            nextTurn();
            expect(blackjack.turn).toBe(0);
        });
        it("Should be able assign blackjack.turn to be 0 when blackjack.turn is equals to 1", function () {
            blackjack.turn = 1;
            nextTurn();
            expect(blackjack.turn).toBe(0);
        });
        it("Should be able to call blackjackDealerMove when blackjack.pstand is equals to true", function () {
            spyOn(game, "blackjackDealerMove").and.callThrough();
            blackjack.turn = 0;
            blackjack.pstand = true;
            nextTurn();
            expect(game.blackjackDealerMove).toHaveBeenCalled();
        });
    });
});