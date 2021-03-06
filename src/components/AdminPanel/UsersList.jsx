import { useEffect, useState } from "react"
import { connect } from "react-redux"
import { Spinner } from '../common/Spinner'
import { deleteUserById, getUsersList, updateUserById } from '../../store/adminReducer'
import { AiOutlineDelete, AiOutlineEdit, AiOutlineSearch } from "react-icons/ai";
import Pagination from "../common/Pagination/Pagination";
import { validateEmail, validateInput } from "../../utils/validation";
import { setError, setMessage } from "../../store/appReducer";

const UsersList = props => {

    let [loading, setLoading] = useState(false)
    let [page, setPage] = useState(1)
    let [searchText, setSearchText] = useState('')
    let [isVisibleUpdateModal, setIsVisibleUpdateModal] = useState(false)
    let [isVisibleDeleteModal, setIsVisibleDeleteModal] = useState(false)

    let [user, setUser] = useState({
        id: '',
        name: '',
        email: '',
        role: 'user'
    })

    const loadAllUsers = async () => {
        setLoading(true)
        await props.getUsersList(searchText, +page)
        setLoading(false)
    }

    useEffect(() => {
        loadAllUsers()
    }, [page, searchText])


    const handleSearchText = async e => setSearchText(e.currentTarget.value)
    const changeUserName = async e => setUser({ ...user, name: e.currentTarget.value })
    const changeUserEmail = async e => setUser({ ...user, email: e.currentTarget.value })
    const changeUserRole = async e => setUser({ ...user, role: e.currentTarget.value })

    const changeUserData = async () => {
        if (user.id){
            if (!validateInput(user.name)){
                props.setError("Треба заповнити ім'я")
            } else if (!validateEmail(user.email)) {
                props.setError("Невірний формат email пошти")
            } else {
                props.updateUserById(user.id, user.name, user.email, user.role)
                closeUpdateUserModal()
            }
        }
    }
    
    const openUpdateUserModal = user => {
        setUser(user)
        setIsVisibleUpdateModal(true)
    }

    const closeUpdateUserModal = () => setIsVisibleUpdateModal(false)


    const confirmDeleting = async () => {
        props.deleteUserById(user.id)
        closeDeleteModal()
    }
    
    const openDeleteModal = (user) => {
        setUser(user)
        setIsVisibleDeleteModal(true)
    }
    const closeDeleteModal = () => setIsVisibleDeleteModal(false)

    return (
        <>
            <div className='admin_header'>
                <div className='admin_title'>Список користувачів</div>
                <div className='admin_search'>
                    <label className='search_container'>
                        <AiOutlineSearch className='search_icon' />

                        <input type="text" placeholder='Пошук' value={searchText} onChange={handleSearchText} />
                    </label>
                </div>
            </div>

            <div className='admin_list'>
                {loading ?
                    <Spinner /> :
                    <table className='admin_table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Користувач</th>
                                <th>Email</th>
                                <th>Роль</th>
                                <th>Дії</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role || 'Користувач'}</td>
                                    <td className='actions_wrapper'>
                                        <AiOutlineEdit className='action' onClick={() => openUpdateUserModal(user)} />
                                        <AiOutlineDelete className='action' onClick={() => openDeleteModal(user)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                }
                <Pagination
                    currentPage={page}
                    handlePageNumberClick={page => setPage(page)}
                    pageSize={10}
                    totalItemsCount={props.usersPagination?.total}
                />
            </div>

            { isVisibleUpdateModal &&
                <div className='update_user_modal'>
                    <div className='auth-block'>
                        <span className='close_modal' onClick={closeUpdateUserModal}>&times;</span>
                        <h3 className='auth-title'>Редагування користувача</h3>
                        <input type="text" value={user.name} onChange={changeUserName} className='auth-input' placeholder="Ім'я" />
                        <select name="role" id="role" className='auth-input' value={user.role} onChange={changeUserRole}>
                            <option value="user">Користувач</option>
                            <option value="admin">Адміністратор</option>
                        </select>
                        <input type="email" value={user.email} onChange={changeUserEmail} className='auth-input' placeholder="E-mail" />
                    
                        <input type="button" value='Зберегти' onClick={changeUserData} className='auth-btn' />
                    </div>
                </div>
            }

            { isVisibleDeleteModal &&
                <div className='update_user_modal'>
                    <div className='auth-block'>
                        <span className='close_modal' onClick={closeDeleteModal}>&times;</span>
                        <h3 className='auth-title'>Видалити користувача</h3>
                    
                        <input type="button" value='Підтвердити' onClick={confirmDeleting} className='auth-btn' />
                    </div>
                </div>
            }
        </>
    )
}

const mapStateToProps = state => ({
    users: state.admin.users,
    usersPagination: state.admin.usersPagination,
})

const mapDispatchToProps = {
    getUsersList,
    deleteUserById,
    updateUserById,
    setError,
    setMessage
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersList)