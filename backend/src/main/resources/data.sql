INSERT INTO components (id, category, brand, model, product_name, price, rating, review_count, image_url, description, created_at) VALUES
(1, 'CPU', 'AMD', 'Ryzen 5 7600', 'AMD Ryzen 5 7600 Desktop Processor', 18500.00, 4.7, 1205, 'https://placeholder.com/cpu1.png', 'Great mid-range gaming CPU.', NOW()),
(2, 'GPU', 'NVIDIA', 'RTX 4060', 'GIGABYTE GeForce RTX 4060 WINDFORCE OC 8G', 30000.00, 4.6, 850, 'https://placeholder.com/gpu1.png', 'Excellent 1080p and decent 1440p gaming performance.', NOW());

INSERT INTO cpus (id, socket, cores, threads, base_clock, boost_clock, cache, tdp, integrated_graphics, architecture) VALUES
(1, 'AM5', 6, 12, '3.8 GHz', '5.1 GHz', '32MB', 65, true, 'Zen 4');

INSERT INTO gpus (id, vram, memory_type, boost_clock, tdp, length, recommended_psu) VALUES
(2, 8, 'GDDR6', '2475 MHz', 115, 272, 450);
