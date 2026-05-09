import {
    getLoggedInUser,
    getUsers,
    setLoggedInUser,
    setUsers
} from "./storageService.js";

function normalizeUser(user) {
    if (!user) return null;
    const pets = Array.isArray(user.Pets) ? user.Pets : [];
    return { ...user, Pets: pets };
}

export function listPetsForCurrentUser() {
    const currentUser = normalizeUser(getLoggedInUser());
    if (!currentUser) return [];
    return currentUser.Pets;
}

export function addPetToCurrentUser(newPet) {
    const currentUser = normalizeUser(getLoggedInUser());
    if (!currentUser) {
        return { ok: false, message: "Нэвтрээгүй хэрэглэгч байна." };
    }

    const nextUser = {
        ...currentUser,
        Pets: [...currentUser.Pets, newPet]
    };

    const users = getUsers();
    const updatedUsers = users.map((user) =>
        user.Email === nextUser.Email ? nextUser : user
    );

    setUsers(updatedUsers);
    setLoggedInUser(nextUser);

    return { ok: true, user: nextUser };
}