import { fetcher } from "@/lib/fetcher"
import { API_URL } from "@/lib/enviroments"
import { IUser } from "@/interfaces/users/IUser"

/**
 * Actualiza un IUser en la base de datos mediante una petición HTTP PUT.
 * Utiliza la función `fetcher` para manejar la solicitud.
 *
 * @param {IUser} IUser - Objeto del IUser que se desea actualizar.
 * Debe incluir el `productID` que será usado para identificar el recurso en la URL.
 *
 * @returns {Promise<void>} - No devuelve nada si la operación es exitosa.
 *
 * @throws {Error} - En caso de error, se muestra un mensaje en la consola.
 *
 * @example
 * await updateUser = {
    name: nombre,
    email: email,
    storeID: tiendaSeleccionada ? parseInt(tiendaSeleccionada) : null
}
 */

export const updateUser = async ( name: string,email: string ): Promise<void> => {
   try {
    await fetcher<void>(`${API_URL}/users/${email}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( {name} ), 
    });
  } catch (error) {
    console.error("Error updating product", error);
  }
};

