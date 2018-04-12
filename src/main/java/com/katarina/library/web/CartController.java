package com.katarina.library.web;

import com.katarina.library.constants.GeneralConstants;
import com.katarina.library.constants.PusherConstants;
import com.katarina.library.model.Book;
import com.pusher.rest.Pusher;
import com.katarina.library.web.vo.ItemRequest;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

/**
 * Controller for the REST API used by the library
 */
@RestController
@SessionAttributes(GeneralConstants.ID_SESSION_LIBRARY)
public class CartController {
	
	private List<Book> books = new ArrayList<Book>();
	
	private Pusher pusher;
	
	/**
	 * Method executed after the object is created
	 * that creates an instance of the Pusher object and
	 * populates the list of Books
	 */
	@PostConstruct
	public void configure() {
		pusher = new Pusher(
				PusherConstants.PUSHER_APP_ID, 
				PusherConstants.PUSHER_APP_KEY, 
				PusherConstants.PUSHER_APP_SECRET
		);
		pusher.setCluster("eu");
		pusher.setEncrypted(true);
		
		Book book = new Book();
		book.setId(1L);
		book.setName("Clean Code: A Handbook of Agile Software Craftsmanship");
		book.setQuantity(5);
		book.setBorrowedCount(0);
		books.add(book);
		
		book = new Book();
		book.setId(2L);
		book.setName("Structure and Interpretation of Computer Programs");
		book.setQuantity(5);
		book.setBorrowedCount(0);
		books.add(book);
		
		book = new Book();
		book.setId(3L);
		book.setName("Design Patterns: Elements of Reusable Object-Oriented Software");
		book.setQuantity(5);
		book.setBorrowedCount(0);
		books.add(book);
		
		book = new Book();
		book.setId(4L);
		book.setName("Head First Design Patterns");
		book.setQuantity(5);
		book.setBorrowedCount(0);
		books.add(book);

		book = new Book();
		book.setId(5L);
		book.setName("Domain-Driven Design: Tackling Complexity in the Heart of Software");
		book.setQuantity(5);
		book.setBorrowedCount(0);
		books.add(book);

		book = new Book();
		book.setId(6L);
		book.setName("Cracking the Coding Interview: 150 Programming Questions and Solutions");
		book.setQuantity(5);
		book.setBorrowedCount(0);
		books.add(book);

		book = new Book();
		book.setId(7L);
		book.setName("Thinking in Java");
		book.setQuantity(5);
		book.setBorrowedCount(0);
		books.add(book);

		book = new Book();
		book.setId(8L);
		book.setName("Effective Java");
		book.setQuantity(5);
		book.setBorrowedCount(0);
		books.add(book);
	}

	/**
	 * Method that returns the Books available for shopping
	 * 
	 * @return List of Book objects
	 */
	@RequestMapping(value = "/books", 
			method = RequestMethod.GET,  
			produces = "application/json")
	public List<Book> getBooks() {
		return books;
	}
	
	/**
	 * Method that returns the list of Books in the current borrowed list
	 * @param borrowedBooks List of Books injected by Spring MVC from the session
	 * @return List of Books
	 */
	@RequestMapping(value = "/cart/items", 
	method = RequestMethod.GET,  
	produces = "application/json")
  public List<Book> getCartItems(@SessionAttribute(GeneralConstants.ID_SESSION_LIBRARY) List<Book> borrowedBooks) {
    return borrowedBooks;
  }
	
	/**
	 * Method to add a Book to the borrowed list
	 * @param request Request object
	 * @param borrowedBooks List of Books injected by Spring MVC from the session
	 * @return Status string
	 */
	@RequestMapping(value = "/cart/item", 
			method = RequestMethod.POST, 
			consumes = "application/json")
	public String addItem(@RequestBody ItemRequest request, @SessionAttribute(GeneralConstants.ID_SESSION_LIBRARY) List<Book> borrowedBooks) {
		Book newBook = new Book();
		Optional<Book> optional = getBookById(books.stream(), request.getId());
		
		if (optional.isPresent()) {
			Book Book = optional.get();

			newBook.setId(Book.getId());
			newBook.setName(Book.getName());
			newBook.setBorrowedCount(request.getCount());
			newBook.setQuantity(request.getQuantity() - request.getCount());
			
			Optional<Book> BookInCart = getBookById(borrowedBooks.stream(), Book.getId());
			String event;
			
			if(BookInCart.isPresent()) {
				event = "itemUpdated";
			} else {
				borrowedBooks.add(newBook);
				event = "itemAdded";	
			}
			pusher.trigger(PusherConstants.CHANNEL_NAME, event, newBook);

		}
		
		return "OK";
	}
	
	/**
	 * Method that deletes an item from the cart
	 * 
	 * @param request Request object
	 * @param borrowedBooks List of Books injected by Spring MVC from the session
	 * @return Status string
	 */
	@RequestMapping(value = "/cart/item", 
			method = RequestMethod.DELETE, 
			consumes = "application/json")
	public String deleteItem(@RequestBody ItemRequest request, @SessionAttribute(GeneralConstants.ID_SESSION_LIBRARY) List<Book> borrowedBooks) {
		Optional<Book> optional = getBookById(books.stream(), request.getId());
		
		if (optional.isPresent()) {
			Book Book = optional.get();
			
			Optional<Book> BookInCart = getBookById(borrowedBooks.stream(), Book.getId());
			
			if(BookInCart.isPresent()) {
				borrowedBooks.remove(BookInCart.get());
				pusher.trigger(PusherConstants.CHANNEL_NAME, "itemRemoved", Book);
			}
		}
		
		return "OK";
	}
	
	/**
	 * Method that empties the whole borrowed books
	 * @param model Object from Spring MVC
	 * @return Status string
	 */
	@RequestMapping(value = "/cart", 
			method = RequestMethod.DELETE)
	public String emptyCart(Model model) {
		model.addAttribute(GeneralConstants.ID_SESSION_LIBRARY, new ArrayList<Book>());
		pusher.trigger(PusherConstants.CHANNEL_NAME, "cartEmptied", "");
		
		return "OK";
	}
	
	/**
	 * Gets a Book by its id from a stream
	 * @param stream That contains the Book to get
	 * @param id Of the Book to get
	 * @return The Book wrapped in an Optional object
	 */
	private Optional<Book> getBookById(Stream<Book> stream, Long id) {
		return stream
		  .filter(Book -> Book.getId().equals(id))
      .findFirst();
	}
}
