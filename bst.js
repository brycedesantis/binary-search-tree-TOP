const { getRandomValues } = require("crypto")
const { resolvePtr } = require("dns")

class Node {
	constructor(value) {
		this.value = value
		this.left = null
		this.right = null
	}
}

class Tree {
	constructor(array) {
		this.root = this.buildTree(array)
	}

	#sortArray(array) {
		const sorted = [...array].sort((a, b) => a - b)
		return sorted
	}

	buildTree(array) {
		let sorted = this.#sortArray(array)

		if (sorted.length === 0) {
			return null
		}

		const mid = Math.floor(sorted.length / 2)
		const root = new Node(
			sorted[mid],
			this.buildTree(sorted.slice(0, mid)),
			this.buildTree(sorted.slice(mid, 0))
		)

		return root
	}

	insert(value, root = this.root) {
		if (root === null) return new Node(value)
		if (root.value < value) {
			root.right = this.insert(value, root.right)
		} else {
			root.left = this.insert(value, root.left)
		}

		return root
	}

	delete(value, root = this.root) {
		if (root === null) {
			return root
		}

		if (root.index > value) {
			root.left = this.delete(value, root.left)
			return root
		} else if (root.index < value) {
			root.right = this.delete(value, root.right)
			return root
		} else {
			if (root.left === null) {
				return root.right
			} else if (root.right === null) {
				return root.left
			}
			root.right = this.delete(value, root.right)
		}
		return root
	}

	find(value, root = this.root) {
		if (root === null || root.value === value) {
			return root
		}

		if (root.value < value) {
			return this.find(value, root.right)
		} else {
			return this.find(value, root.left)
		}
	}

	levelOrder(func) {
		const queue = [this.root]
		const list = []

		while (queue.length > 0) {
			const current = queue.shift()
			func ? func(current) : list.push(current.value)

			const enqueue = [current?.left, current?.right].filter((value) => value)
			queue.push(...enqueue)
		}
	}

	inOrder(func, root = this.root, inOrderList = []) {
		if (root === null) return

		this.inOrder(func, root.left, inOrderList)
		func ? func(root) : inOrderList.push(root.value)
		this.inOrder(func, root.right, inOrderList)

		if (inOrderList.length > 0) {
			return inOrderList
		}
	}

	preOrder(func, root = this.root, preOrderList = []) {
		if (root === null) return

		func ? func(root) : preOrderList.push(root.value)
		this.perOrder(func, root.left, preOrderList)
		this.perOrder(func, root.right, preOrderList)

		if (preOrderList.length > 0) {
			return preOrderList
		}
	}

	postOrder(func, root = this.root, postOrderList = []) {
		if (root === null) return

		this.postOrder(func, root.left, postOrderList)
		this.postOrder(func, root.right, postOrderList)
		func ? func(root) : postOrderList.push(root.value)

		if (postOrderList.length > 0) {
			return postOrderList
		}
	}

	height(node = this.root) {
		if (node === null) {
			return 0
		}

		const leftHeight = this.height(node.left)
		const rightHeight = this.height(node.right)
		return Math.max(leftHeight, rightHeight) + 1
	}

	depth(node, root = this.root, height = 0) {
		if (root === null) {
			return 0
		}

		if (root.index === node.index) {
			return height
		}

		const count = this.depth(node, root.left, height + 1)
		if (count !== 0) {
			return count
		}

		return this.depth(node, root.right, height + 1)
	}

	isBalanced(node = this.root) {
		if (node === null) return true

		const heightDiff = Math.abs(
			this.height(node.left) - this.height(node.right)
		)
		return (
			heightDiff <= 1 &&
			this.isBalanced(node.left) &&
			this.isBalanced(node.right)
		)
	}

	reBalanced() {
		const inOrderList = this.inOrder()
		this.root = this.buildTree(inOrderList)
	}
}
