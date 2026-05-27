import { db } from '../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc
} from 'firebase/firestore';

// Minimal Firestore helpers for users and orders
export async function fetchUsers() {
  const col = collection(db, 'users');
  const snap = await getDocs(col);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addUserFirestore(user) {
  if (user.id) {
    const ref = doc(db, 'users', user.id.toString());
    await setDoc(ref, user);
    return { id: user.id.toString(), ...user };
  }
  const ref = await addDoc(collection(db, 'users'), user);
  return { id: ref.id, ...user };
}

export async function updateUserFirestore(id, data) {
  const ref = doc(db, 'users', id.toString());
  await updateDoc(ref, data);
}

export async function deleteUserFirestore(id) {
  const ref = doc(db, 'users', id);
  await deleteDoc(ref);
}

// Orders
export async function fetchOrders(branch = null) {
  const col = collection(db, 'orders');
  let snap;
  if (branch) {
    const q = query(col, where('branch', '==', branch));
    snap = await getDocs(q);
  } else {
    snap = await getDocs(col);
  }
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addOrderFirestore(order) {
  if (order.id) {
    const ref = doc(db, 'orders', order.id.toString());
    await setDoc(ref, order);
    return { id: order.id.toString(), ...order };
  }
  const ref = await addDoc(collection(db, 'orders'), order);
  return { id: ref.id, ...order };
}

export async function updateOrderFirestore(id, data) {
  const ref = doc(db, 'orders', id.toString());
  await updateDoc(ref, data);
}

export async function deleteOrderFirestore(id) {
  const ref = doc(db, 'orders', id);
  await deleteDoc(ref);
}

export default {
  fetchUsers,
  addUserFirestore,
  updateUserFirestore,
  deleteUserFirestore,
  fetchOrders,
  addOrderFirestore,
  updateOrderFirestore,
  deleteOrderFirestore
};
