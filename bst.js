const { getRandomValues } = require("crypto")
const { resolvePtr } = require("dns")

class Node {
	constructor(index = null, left = null, right = null) {
		this.index = index
		this.left = left
		this.right = right
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

	#minimum(root) {
		let min = root.index
		while (root.left !== null) {
			min = root.left.index
			root = root.left
		}
		return min
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
			this.buildTree(sorted.slice(mid + 1))
		)

		return root
	}

	insert(value, root = this.root) {
		if (root === null) return new Node(value)
		if (root.index < value) {
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
			root.index = this.#minimum(root.right)
			root.right = this.delete(value, root.right)
		}
		return root
	}

	find(value, root = this.root) {
		if (root === null) {
			return root
		}

		if (root.index !== value) {
			if (root.index < value) {
				return this.find(value, root.right)
			} else {
				return this.find(value, root.left)
			}
		}
		return root
	}

	levelOrder(func) {
		if (!this.root) return []
		const queue = [this.root]
		const list = []

		while (queue.length) {
			let level = []
			for (let i = 0; i < queue.length; i++) {
				const node = queue.shift()
				level.push(node.index)
				if (node.left) queue.push(node.left)
				if (node.right) queue.push(node.right)
				if (func) func(node)
			}
			list.push(level)
		}
		if (!func) return list
	}

	inOrder(func, root = this.root, inOrderList = []) {
		if (root === null) return

		this.inOrder(func, root.left, inOrderList)
		func ? func(root) : inOrderList.push(root.index)
		this.inOrder(func, root.right, inOrderList)

		if (inOrderList.length > 0) {
			return inOrderList
		}
	}

	preOrder(func, root = this.root, preOrderList = []) {
		if (root === null) return

		func ? func(root) : preOrderList.push(root.index)
		this.preOrder(func, root.left, preOrderList)
		this.preOrder(func, root.right, preOrderList)

		if (preOrderList.length > 0) {
			return preOrderList
		}
	}

	postOrder(func, root = this.root, postOrderList = []) {
		if (root === null) return

		this.postOrder(func, root.left, postOrderList)
		this.postOrder(func, root.right, postOrderList)
		func ? func(root) : postOrderList.push(root.index)

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

let binary = new Tree([1, 2, 3, 4, 5, 6])

console.log(binary.preOrder())
