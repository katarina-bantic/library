package com.katarina.library.model;

import java.io.Serializable;

/**
 * Object that represents a book
 *
 */
public class Book implements Serializable {

	/**
	 * UID for serialization
	 */
	private static final long serialVersionUID = 6705527563808382509L;

	private Long id;

	private String name;

	private Integer quantity;

	private Integer borrowedCount;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public Integer getBorrowedCount() {
		return borrowedCount;
	}

	public void setBorrowedCount(Integer count) {
		this.borrowedCount = count;
	}
	
	@Override
	public boolean equals(Object that) {
		if ( this == that ) return true;
	  if ( !(that instanceof Book) ) return false;
	  
	  Book book = (Book)that;
	  return this.id != null && this.id.equals(book.id);
	}
}
