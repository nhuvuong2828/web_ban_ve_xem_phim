package com.cinema.api.repository;
import com.cinema.api.entity.GoiYCanhanHoa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GoiYCanhanHoaRepository extends JpaRepository<GoiYCanhanHoa, String> {
    List<GoiYCanhanHoa> findByNguoiDung_MaNguoiDungOrderByDiemPhuHopDesc(String maNguoiDung);
}