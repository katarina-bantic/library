  function validate(toBorrow, quantity) {
	  // true means invalid, so our conditions got reversed
	  return {
		  toBorrow: toBorrow.length === 0,
		  isNaN: isNaN(toBorrow),
		  condition: toBorrow > quantity
		  };
  }

var Book = React.createClass({
  getInitialState: function() {
    return {
      toBorrow: 1
    };
  },

  updateBorrowCount: function(evt) {
	this.setState({
		toBorrow: evt.target.value
	});
  },
  
  borrowBooks: function() {
    fetch('/cart/item', {
      credentials: 'same-origin',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: this.props.book.id,
        quantity: this.props.book.quantity,
        count: this.state.toBorrow,
     })
    });
  },
	  
  render: function() {
    var name = this.props.book.name;
    var quantity = this.props.book.quantity;

    const errors = validate(this.state.toBorrow, this.props.book.quantity);
    const isDisabled = Object.keys(errors).some(x => errors[x]);
    
    return (
        <div className="col-xs-12 col-item extra-bottom-margin">
          <div className="info">
            <div className="row">
                <h5>{name}</h5>
            </div>
            <div className="separator clear-left">
	          <p className="section-avail">
	            <span>{quantity}</span>
	          </p>
              <p className="section-qty">
                <input className="form-control input-sm" type="text" value={this.state.toBorrow} onChange={this.updateBorrowCount} />
              </p>
              <p className="section-add">
                <button type="button" className="btn btn-link btn-xs" disabled={isDisabled} onClick={this.borrowBooks}>
                  <span className="hidden-sm">Borrow</span>
                </button>
              </p>
            </div>
            <div className="clearfix"></div>
          </div>
        </div>
    );
  }
});