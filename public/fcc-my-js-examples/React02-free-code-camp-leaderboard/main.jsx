class TableHeader extends React.Component {
    render() {
        let thStyle = {
            padding: '15px',
            'padding-left': '0',
            'background-color': '#999',
            'font-weight': 700
        };

        let thLinkStyle = {
            padding: '15px',
            'padding-left': '0',
            'background-color': '#999',
            'font-weight': 700,
            'cursor': 'pointer',
            'text-decoration': 'underline',
            'color': 'blue',
        };

        let v1='', v2='';
        if(this.props.column === "recent") {
            if(this.props.reverse) v1="\\/";
            else v1='/\\';
        } else {
            if(this.props.reverse) v2="\\/";
            else v2='/\\';
        }

        return (
            <thead>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Photo</th>
                <th style={thStyle}>Camper Name</th>
                <th onClick={this.props.sortTable.bind(this,"recent")} style={thLinkStyle}>30 day points {v1}</th>
                <th onClick={this.props.sortTable.bind(this,"alltime")} style={thLinkStyle}>All time points {v2}</th>
            </thead>
        );
    }
}


/*
 *  Component represents a user row in the table and a handler for user updates
 */
class TableRow extends React.Component {
  render() {
    let style = {};
    if(this.props.count % 2 === 0) {
        style = { 'background-color': '#999', 'font-weight': 700 };
    } else {
        style = { 'background-color': '#ccc', 'font-weight': 700 };
    }

    return (
      <tr style={style}>
        <td>{this.props.count}</td>
        <td>
          <a href={"https://www.freecodecamp.com/"+this.props.user.username} target="_blank">
            <img src={this.props.user.img} width="50" height="50" />
          </a>
        </td>
        <td>
          <a href={"https://www.freecodecamp.com/"+this.props.user.username} target="_blank">
            <span>{this.props.user.username}</span>
          </a>
        </td>
        <td>{this.props.user.recent}</td>
        <td>{this.props.user.alltime}</td>
      </tr>
    );
  }
}


class LeaderTable extends React.Component {
    render() {
        var count = 0;
        var userlist = this.props.users.map(function(user) {
            count++;
            return (
                <TableRow
                    user={user}
                    key={user.username}
                    count={count}
                    updatePage={this.props.updatePage}
                />
            );
        }.bind(this));

        let style = {
            border: '1px solid black',
            padding: '10px'
        };

        return (
            <table style={style}>
                <TableHeader column={this.props.column} reverse={this.props.reverse} sortTable={this.props.sortTable}/>
                <tbody>
                    {userlist}
                </tbody>
            </table>
        );
    }
}


class MainContainer extends React.Component {
  constructor() {
    super();
    this.state = { 
      users: [],
      reverse: true,
      column: "recent"
    }
  }
  getData() {
    $.ajax({
      url: this.props.apiroot+"top/"+this.state.column,
      dataType: 'json',
      cache: false,
      success: function(data) {
        var users = data;
        this.setState({users: users});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.apiroot, status, err.toString());
      }.bind(this)
    });
  }
  componentDidMount() {
    this.getData();
  }
  render() {
    return (
        <LeaderTable
            users={this.state.users}
            column={this.state.column}
            reverse={this.state.reverse}
            updatePage={this.getData.bind(this)}
            sortTable={this.sortTable.bind(this)}
        />
    );
  }
  sortTable(column) {
     if (column !== this.state.column) {
        this.setState({reverse: true, column: column},  this.getData);
     } else {
        let reverse = !this.state.reverse;

        let users = this.state.users.sort(
            this.state.reverse ?
            function(a,b){return Number(a[column]) - Number(b[column]);} :
            function(a,b){return Number(b[column]) - Number(a[column]);}
        );

        this.setState({reverse:reverse, users:users});
     }
   }
}


React.render(
    <MainContainer apiroot="https://fcctop100.herokuapp.com/api/fccusers/" />,
    document.getElementById("myrootcomponent")
);
