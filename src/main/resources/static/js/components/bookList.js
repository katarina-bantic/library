var BookList = React.createClass({
  render: function() {

    var booksMapped = this.props.books.map(function (book, index) {
      return <Book book={book} key={index} />
    });

    return (
        <div className="col-xs-6 col-xs-offset-3">
            <div className="panel panel-info">
                <div className="panel-heading">
                    <div className="panel-title">
                        <div className="row">
                            <div className="col-xs-12">
                                <h5>Available books</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="panel-body">
                    <div className="row">
                        {booksMapped}
                    </div>
                </div>
            </div>
        </div>
    );
  }
});