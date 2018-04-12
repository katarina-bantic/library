package com.katarina.library.web.vo;

import java.io.Serializable;

/**
 * Value Object that represents a request to add or delete an item to the borrowed list
 */
public class ItemRequest  implements Serializable {

	/**
	 * UID for serialization
	 */
	private static final long serialVersionUID = 7720978167137384733L;

	private Long id;

	private Integer quantity;

	private Integer count;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Integer getCount() {
		return count;
	}

	public void setCount(Integer count) {
		this.count = count;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}
}
