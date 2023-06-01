use std::cell::RefCell;
use std::rc::Rc;
use std::fmt;

#[derive(Debug)]
struct Node {
    data: String,
    neighbors: Vec<NodeWrapper>,
}

#[derive(Clone)]
struct NodeWrapper(Rc<RefCell<Node>>);

impl Node {
    fn new(data: String) -> NodeWrapper {
        NodeWrapper(Rc::new(RefCell::new(Node {
            data,
            neighbors: Vec::new(),
        })))
    }
}


impl NodeWrapper {
    fn borrow(&self) -> std::cell::Ref<'_, Node> {
        self.0.borrow()
    }

    fn borrow_mut(&self) -> std::cell::RefMut<'_, Node> {
        self.0.borrow_mut()
    }
}

impl fmt::Debug for NodeWrapper {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Node {{ data: {} }}", self.borrow().data)?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {

    #[test]
    fn basic_usage () {
        let mut master_list: Vec<NodeWrapper> = Vec::new();

        // Create nodes
        let node1 = Node::new("1".to_string());
        master_list.push(node1.clone());

        let node2 = Node::new("2".to_string());
        master_list.push(node2.clone());

        let node3 = Node::new("3".to_string());
        master_list.push(node3.clone());

        // Connect nodes
        node1.borrow_mut().neighbors.push(node2.clone());
        node1.borrow_mut().neighbors.push(node3.clone());
        node2.borrow_mut().neighbors.push(node3.clone());
        node3.borrow_mut().neighbors.push(node1.clone());

        // for node_wrapper in master_list.iter() {
        //     println!("{:#?}", node_wrapper.borrow());
        // }

        node1.borrow_mut().data = "4".to_string();

        // for node_wrapper in master_list.iter() {
        //     println!("{:#?}", node_wrapper.borrow());
        // }

        assert_eq!(master_list.len(), 3);
    }
}