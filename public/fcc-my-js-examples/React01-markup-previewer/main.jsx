const initialValue=`
# Jean-Francois de Galaup, comte de Laperouse
## French Naval officer and explorer

![photo](https://upload.wikimedia.org/wikipedia/commons/5/58/Laperouse_1.jpg)

### Time line:

- _**1741**_ born near Albi, France
- _**1756**_ entered the naval college in Brest
- _**1757**_ he was posted to the Celebre and participated in a supply expedition to the fort of Louisbourg in New France
- _**1758**_ took part in a second supply expedition in 1758 to Louisbourg
- _**1759**_ wounded in the Battle of Quiberon Bay, captured, imprisoned (Seven Years' War)
- _**1760**_ exchanged and back to France
- _**1762**_ participated attempt by the French to gain control of Newfoundland
- _**1781**_ following the Franco-American alliance, Laperouse fought against the Royal Navy off the American coast, and victoriously led the frigate Astree in the Naval battle of Louisbourg
- _**1781**_ promoted to the rank of commodore when he defeated the English frigate Ariel in the West Indies
- _**1782**_ captured two English forts on the coast of Hudson Bay, but allowed the survivors to sail off to England in exchange for a promise to release French prisoners held in England
- _**1785**_ appointed by Louis XVI and his Minister of the Marine, the Marquis de Castries, to lead an expedition around the world
- _**1785**_ start of expedition
- _**1785**_ investigated the Spanish colonial government in the Captaincy General of Chile
- _**1786**_ he became the first European to set foot on the Hawaiian islands, he was first non-Spanish visitor to California since Drake in 1579, crossed the Pacific Ocean in 100 days, arriving at Macau, where he sold the furs acquired in Alaska
- _**1787**_ visited the Asian mainland coasts of Korea, discoveries in the Sea of Japan and Sea of Okhotsk, rested in Petropavlovsk on the Russian Kamchatka peninsula
- _**1788**_ Botany Bay, western and southern coasts of Australia
- _**1788**_ died possibly on Solomon Islands

[Wikiedia article](https://en.wikipedia.org/wiki/Jean-Fran%C3%A7ois_de_Galaup,_comte_de_Lap%C3%A9rouse)
`;

let MainContainer = React.createClass({
    updateValue:function(modifiedValue){
        this.setState({
            value: modifiedValue
        });
    },
    getInitialState:function(){
        return {
            value: initialValue
        };
    },
    getRawMarkup: function(value) {
        let rawMarkup = marked(value, {sanitize: true});
        return { __html: rawMarkup };
    },
    render: function(){
        return (
          <div className="row">
            <div className="col-md-5">
                <h3><u>Raw input text:</u></h3>
                <RawInput value={this.state.value} onInputUpdate={this.updateValue} />
            </div>
            <div className="col-md-7">
                <h3><u>Marked up text:</u></h3>
                <div dangerouslySetInnerHTML={this.getRawMarkup(this.state.value)} />
            </div>
          </div>
        );
    }
});

let RawInput = React.createClass({
    rawInputUpdate:function(){
        let modifiedValue=this.refs.inputVal.getDOMNode().value;
        this.props.onInputUpdate(modifiedValue);
    },
    render:function(){
        return (<textarea rows="22" ref="inputVal" value={this.props.value} onChange={this.rawInputUpdate} className="form-control" />);
    }
});

React.render(<MainContainer />,document.getElementById("mycontainer"));
