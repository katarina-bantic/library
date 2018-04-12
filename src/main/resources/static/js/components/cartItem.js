var CartItem = React.createClass({
  deleteItem: function() {
    fetch('/cart/item', {
      credentials: 'same-origin',
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: this.props.item.id,
     })
    });
  },

  render: function() {
    var name = this.props.item.name;
    var toBorrow = this.props.item.borrowedCount;
    

    return (
      <div className="row cart-item">
        <div className="col-xs-4">
          <h6><strong>{name}</strong></h6>
        </div>
        <div className="col-xs-4">
          <div className=" text-center">
            <h6>{toBorrow}</h6>
          </div>
        </div>
        <div className="col-xs-4 text-center">
	        <button type="button" className="btn btn-link btn-xs" onClick={this.deleteItem}>
	          <i className="fa fa-trash-o fa-lg"></i>
	        </button>
        </div>
      </div>
    );
  }
});