var Cart = React.createClass({
  emptyCart: function() {
    fetch('/cart', {
      credentials: 'same-origin',
      method: 'DELETE'
    });
  },
	  
  render: function() {
    var itemsMapped = this.props.items.map(function (item, index) {
      return <CartItem item={item} key={index} />
    });

    var empty = <div className="alert alert-info">No borrowed books!</div>;

    return (
        <div className="col-xs-8 col-xs-offset-2">
          <div className="panel panel-info">
            <div className="panel-heading">
              <div className="panel-title">
				<div className="row">
                  <div className="col-xs-12">
                    <h5>Borrowed books</h5>
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-body">
              <div className="row">
                <div className="col-xs-4">
                  <h6><strong>Book</strong></h6>
                </div>
                <div className="col-xs-4">
                  <div className="col-xs-4 text-center">
                    <h6><strong>Quantity</strong></h6>
                  </div>
                  <div className="col-xs-4 text-center">
                    &nbsp;
                  </div>
                </div>
              </div>
              {itemsMapped.length > 0 ? itemsMapped : empty}
            </div>
            <div className="panel-footer">
              <div className="row text-center">
                <div className="col-xs-3">
                  <button type="button" className="btn btn-info btn-sm btn-block" onClick={this.emptyCart} disabled={itemsMapped.length == 0}>
                    Return all books
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
});