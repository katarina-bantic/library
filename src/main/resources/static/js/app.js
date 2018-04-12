var App = React.createClass({
  getInitialState: function() {
    return { items: [], books: [] };
  },
  getBooks: function(){
      fetch('/books').then(function(response) {
          return response.json();
      }).then(this.getBooksSuccess);
  },
  getCartItems(){
      fetch('/cart/items', {
          credentials: 'same-origin',
      }).then(function(response) {
          return response.json();
      }).then(this.getCartItemsSuccess);
  },

  componentWillMount: function() {
    Pusher.logToConsole = true;
    this.pusher = new Pusher(PUSHER_APP_KEY, {
        cluster: 'eu',
      encrypted: true,
    });
    this.channel = this.pusher.subscribe(PUSHER_CHANNEL_NAME);
  },

  componentDidMount: function() {
    this.channel.bind('itemAdded', this.itemAdded);
    this.channel.bind('itemUpdated', this.itemUpdated);
    this.channel.bind('itemRemoved', this.itemRemoved);
    this.channel.bind('cartEmptied', this.cartEmptied);

    this.getBooks();
    this.getCartItems();
  },

  componentWillUnmount: function() {
	// Unbind from channel events
    this.channel.unbind();

    // Unsubscribe from the Pusher channel
    this.pusher.unsubscribe(this.channel);
    
    // Unregister by assign them to an empty function
    this.getBooksSuccess = function() {};
    this.getCartItemsSuccess = function() {};
  },

  itemAdded: function(item) {
    var newItems = this.state.items.slice(0);
    newItems.push(item);

    var indexToUpdate;
    var newBooks = this.state.books.slice(0);
    this.state.books.some(function(it, index) {
      if(it.id === item.id) {
        indexToUpdate = index;
        return true;
      }
    });
    newBooks[indexToUpdate].quantity = item.quantity;
    this.setState({
        items: newItems,
        books: newBooks
    });
  },

  itemUpdated: function(item) {
    var newItems = this.state.items.slice(0);
    var indexToUpdate;
    this.state.items.some(function(it, index) {
      if(it.id === item.id) {
        indexToUpdate = index;
        return true;
      }
    });
    newItems[indexToUpdate].borrowedCount = newItems[indexToUpdate].borrowedCount + item.borrowedCount;

    var newBooks = this.state.books.slice(0);
    this.state.books.some(function(it, index) {
      if(it.id === item.id) {
        indexToUpdate = index;
        return true;
      }
    });
    newBooks[indexToUpdate].quantity = item.quantity;

    this.setState({
      items: newItems,
      books: newBooks,
    });
  },

  itemRemoved: function(item) {
    var newItems = this.state.items.slice(0);
    var indexToRemove;
    this.state.items.some(function(it, index) {
      if(it.id === item.id) {
        indexToRemove = index;
        return true;
      }
    });
    newItems.splice(indexToRemove, 1);

    var indexToUpdate;
    var newBooks = this.state.books.slice(0);
      this.state.books.some(function(it, index) {
        if(it.id === item.id) {
          indexToUpdate = index;
          return true;
        }
      });
      newBooks[indexToUpdate].quantity = item.quantity;
      this.setState({
        items: newItems,
        books: newBooks,
      });
  },

  cartEmptied: function() {
	var newArray = [];
	
    this.setState({
      items: newArray
    });

    this.getBooks();
  },
  
  getBooksSuccess: function(response) {
    this.setState({
    	books: response
    });
  },
  
  getCartItemsSuccess: function(response) {
	this.setState({
	  items: response
	});
  },

  render: function() {
    return (
      <div>
        <Header  />
        <div className="col-xs-6">
        	<BookList books={this.state.books} />
        </div>
        <div className="col-xs-6">
            <Cart items={this.state.items}/>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<App />, document.getElementById("app"));