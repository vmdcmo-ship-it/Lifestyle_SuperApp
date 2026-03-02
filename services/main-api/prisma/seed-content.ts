/**
 * Seed script: Tạo văn bản mặc định (Chính sách bảo mật, Điều khoản dịch vụ & Quyền sử dụng)
 * Chạy: npx ts-node prisma/seed-content.ts
 * Cập nhật văn bản đã tồn tại: npx ts-node prisma/seed-content.ts --update
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_DOCS = [
  {
    slug: 'privacy-policy',
    locale: 'vi',
    title: 'Chính sách bảo mật',
    content: `<h2>1. Giới thiệu</h2>
<p>Lifestyle Super App cam kết bảo vệ quyền riêng tư của người dùng. Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.</p>

<h2>2. Thu thập thông tin</h2>
<p>Chúng tôi thu thập thông tin khi bạn đăng ký, sử dụng dịch vụ hoặc liên hệ hỗ trợ. Các thông tin có thể bao gồm: họ tên, email, số điện thoại, địa chỉ.</p>

<h2>3. Sử dụng thông tin</h2>
<p>Thông tin được sử dụng để cung cấp dịch vụ, cải thiện trải nghiệm và liên lạc khi cần thiết.</p>

<h2>4. Bảo mật</h2>
<p>Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức phù hợp để bảo vệ dữ liệu của bạn.</p>

<p><em>Vui lòng chỉnh sửa nội dung chi tiết qua Web Admin → Trung tâm thông tin.</em></p>`,
    targetApps: 'ALL',
  },
  {
    slug: 'terms-of-service',
    locale: 'vi',
    title: 'Điều khoản dịch vụ & Quyền sử dụng',
    content: `<h2>Quyền sử dụng</h2>
<p>Chúng tôi luôn có những chính sách rõ ràng để giải thích các trường hợp tài khoản Đối tác tài xế/hành khách của bạn bị khóa tạm thời hay bị ngừng hợp tác/cung cấp dịch vụ vĩnh viễn. Tuy nhiên, sẽ luôn có những sự việc không thể dự đoán trước mà kết quả cuối cùng có thể khiến bạn mất quyền truy cập tài khoản tài xế/hành khách của mình. Những chính sách và quyết định của Lifestyle luôn dựa trên tiêu chí: An Toàn, Chất Lượng, Vấn Đề Gian Lận, Bảo Mật Thông Tin và Vấn Đề Phân Biệt Đối Xử.</p>

<h3>1. Các Vấn Đề An Toàn Chung</h3>
<p>Tại Lifestyle, chúng tôi sử dụng những công nghệ hiện đại nhằm mục đích đảm bảo an toàn cho cả hành khách và Đối tác tài xế.</p>
<p><strong>Nguyên nhân khiến tài khoản Đối tác tài xế/Hành khách của bạn bị khóa tạm thời hay bị ngừng hợp tác/cung cấp dịch vụ vĩnh viễn?</strong></p>
<p>Khi Lifestyle biết được những hành vi đe dọa sự an toàn của Đối tác tài xế và hành khách, chúng tôi sẽ điều tra làm rõ sự việc và tài khoản của bạn có thể sẽ bị khóa tạm thời hoặc bị ngừng hợp tác/cung cấp dịch vụ vĩnh viễn. Nếu vi phạm bị lặp lại nhiều lần, vấn đề phát sinh nghiêm trọng; có nhiều phàn nàn hoặc phàn nàn nghiêm trọng về việc lái xe kém, không an toàn hoặc không tập trung, chúng tôi sẽ ngừng hợp tác với bạn vĩnh viễn. Mọi hành vi liên quan đến bạo lực, quấy rối tình dục, phân biệt đối xử và hoạt động phi pháp khác khi đang sử dụng Lifestyle có thể khiến bạn bị xóa tài khoản ngay lập tức. Ngoài ra, khi có sự tham gia của cơ quan pháp luật, chúng tôi sẽ hợp tác với hoạt động điều tra của họ.</p>
<p>Dưới đây là một số ví dụ về những hành vi không đảm bảo an toàn cho Đối tác tài xế và hành khách:</p>
<ul>
<li><strong>Sử dụng ngôn ngữ, cử chỉ không phù hợp hoặc có tính chất lăng mạ, phân biệt</strong><br>Ví dụ: Dùng lời nói đe dọa và có những cử chỉ hung hăng, phân biệt đối xử; đưa ra những câu hỏi khai thác đời tư cá nhân, khêu gợi tình dục như: "chồng em chắc giàu lắm?", "Mấy người mắt hí là không đáng tin cậy", "Anh mà cho tôi 1 sao là tôi đến nhà anh xử anh", "Anh chạy xe chắc mệt lắm, để em giúp anh thư giãn."</li>
<li><strong>Tiếp xúc, đụng chạm cơ thể với hành khách/Đối tác tài xế</strong><br>Trong mọi trường hợp, Lifestyle không cho phép bất cứ hành vi quấy rối tình dục nào với Đối tác tài xế/Hành khách trên xe hay trong chuyến đi.<br>Ví dụ: Không đụng chạm cơ thể đặc biệt là đụng chạm vào các bộ phận nhạy cảm; sử dụng lời nói mang tính tán tỉnh như: "Em có bạn trai chưa, nếu chưa cho anh cơ hội được không?"</li>
<li><strong>Đánh nhau, tranh cãi có va chạm, gây thương tích</strong><br>Ví dụ: Đối tác tài xế đánh, xô ngã hành khách, người thân hay người đi cùng hành khách và ngược lại, hành khách, người thân hay người đi cùng hành hung Đối tác tài xế.</li>
<li><strong>Lái xe an toàn</strong><br>Chúng tôi luôn mong muốn Đối tác tài xế sẽ luôn lái xe an toàn và tuân thủ luật giao thông khi lái xe, dừng và đỗ xe như: tập trung cao độ khi lái xe, hạn chế phanh và đánh lái gấp, không tăng tốc đột ngột, nghỉ ngơi một chút khi đối tác cảm thấy mệt.</li>
<li><strong>Làm hư hỏng tài sản của Đối tác tài xế</strong><br>Ví dụ: Đập vỡ, làm hỏng xe hoặc tài sản của Đối tác tài xế; hút thuốc hoặc nôn ói do uống quá nhiều rượu bia; cố ý làm bẩn xe.</li>
</ul>

<h3>2. Tuyệt Đối Không Cho Phép Ma Túy, Rượu, Bia Và Các Chất Kích Thích Khác</h3>
<p>Lifestyle tuyệt đối không cho phép các Đối tác tài xế sử dụng ma túy, rượu, bia và các chất kích thích khác trước và trong khi lái xe.</p>
<p><strong>Nguyên nhân khiến tài khoản Đối tác tài xế/Hành khách của bạn bị khóa tạm thời hay bị ngừng hợp tác/cung cấp dịch vụ vĩnh viễn?</strong></p>
<p>Chúng tôi sẽ ngừng hợp tác vĩnh viễn với bất kỳ Đối tác tài xế nào nếu xác định đối tác đó chịu ảnh hưởng của ma túy, rượu bia và các chất kích thích khác khi đang sử dụng ứng dụng Lifestyle.</p>
<p>Lifestyle cũng sẽ xem xét ngừng hợp tác vĩnh viễn với bất kỳ Đối tác tài xế nào nhận được nhiều phàn nàn chưa được xác nhận về việc sử dụng ma túy, rượu bia và các chất kích thích khác. Đối với hành khách, chúng tôi sẽ ngừng cung cấp dịch vụ vĩnh viễn nếu bạn sử dụng ma túy trong chuyến đi.</p>

<h3>3. Tuân Thủ Pháp Luật Việt Nam</h3>
<p>Chúng tôi hy vọng các Đối tác tài xế/Hành khách sử dụng ứng dụng Lifestyle luôn tuân thủ tất cả các luật và quy định về giao thông đường bộ.</p>
<p><strong>Nguyên nhân khiến tài khoản Đối tác tài xế/Hành khách của bạn bị khóa tạm thời hay bị ngừng hợp tác/cung cấp dịch vụ vĩnh viễn?</strong></p>
<p>Lifestyle có thể tạm khóa tài khoản Đối tác tài xế của bạn hoặc ngừng hợp tác vĩnh viễn vì các hoạt động như: nhắn tin khi đang lái xe, chạy quá tốc độ cho phép, tham gia vào hoạt động phi pháp nghiêm trọng khi đang sử dụng ứng dụng Lifestyle như buôn lậu, buôn ma túy và các hàng hóa bị cấm khác; không có giấy chứng nhận đăng ký xe hoặc giấy phép lái xe hợp lệ; các hành vi vi phạm giao thông nghiêm trọng hoặc hành vi vi phạm giao thông cho thấy dấu hiệu lái xe không an toàn khi đang sử dụng ứng dụng Lifestyle; các hành vi vi phạm luật và quy định về giao thông đường bộ khác.</p>
<p>Đối với tài khoản hành khách, Lifestyle có thể tạm khóa hoặc ngừng cung cấp dịch vụ vĩnh viễn khi bạn có hành động vi phạm pháp luật như: yêu cầu Đối tác tài xế vi phạm luật giao thông như chạy quá tốc độ, chở quá số người quy định, không đội nón bảo hiểm, không thắt dây an toàn hoặc sử dụng Lifestyle để thực hiện hành vi phạm pháp như buôn lậu, buôn ma túy và các hàng hóa bị cấm khác; các hành vi vi phạm luật và quy định về giao thông đường bộ khác.</p>

<h3>4. Cấm Mang Theo Vũ Khí</h3>
<p>Lifestyle nghiêm cấm hành khách và Đối tác tài xế mang súng và vũ khí (trái với quy định của pháp luật Việt Nam) lên xe khi đang sử dụng ứng dụng của chúng tôi. Nếu bạn vi phạm chính sách cấm mang súng và vũ khí của Lifestyle, chúng tôi có thể ngừng hợp tác/cung cấp dịch vụ với bạn vĩnh viễn.</p>

<h3>5. Gian Lận Và Lạm Dụng</h3>
<p>Chúng tôi theo dõi trên hệ thống của mình để phát hiện những hành khách và Đối tác tài xế có thể có hành vi gian lận hay tìm cách điều khiển hệ thống của chúng tôi. Việc gian lận và lợi dụng lỗ hổng của ứng dụng để gian lận sẽ ảnh hưởng nghiêm trọng đến chất lượng dịch vụ và quy tắc cốt lõi của Lifestyle.</p>
<p><strong>Nguyên nhân khiến tài khoản Đối tác tài xế/Hành khách của bạn bị khóa tạm thời hay bị ngừng hợp tác/cung cấp dịch vụ vĩnh viễn?</strong></p>
<p>Với tài khoản Đối tác tài xế, chúng tôi có thể ngừng hợp tác vĩnh viễn ngay lập tức mà không cần thông báo trước nếu bất kỳ tài khoản nào có liên quan đến hoạt động gian lận hay lợi dụng lỗ hổng ứng dụng của Lifestyle để gian lận như: tạo nhiều tài khoản cho cùng một dịch vụ Lifestyle nhằm các mục đích sai trái; sử dụng phần mềm hoặc bất kỳ phương pháp nào khác để điều khiển hoặc tạo chuyến đi không có thật hoặc thông tin tài khoản sai; sử dụng biện pháp không phù hợp để lợi dụng tiền hỗ trợ, cước phí chuyến đi, điều chỉnh chuyến đi, cước phí hỗ trợ hay xếp hạng cao hơn; chấp nhận yêu cầu chuyến đi mà không có ý định hoàn thành, bao gồm cả xúi giục hành khách hủy yêu cầu; tạo tài khoản hành khách hoặc tài xế bằng thông tin giả mạo hoặc nhằm mục đích gian lận; đòi phí hoặc cước phí trên cơ sở sai lệch hay gian lận; cố ý chấp nhận hoặc hoàn thành chuyến đi gian lận cũng như các hành vi gian lận và lạm dụng khác.</p>
<p>Đối với hành khách, Lifestyle có thể ngừng cung cấp dịch vụ với tài khoản hành khách khi có các hoạt động gian lận, lạm dụng Lifestyle như: tạo nhiều tài khoản trùng lặp, nhiều tài khoản trên cùng thiết bị, hoạt động thông đồng giữa hành khách và Đối tác tài xế hay lạm dụng các chương trình khuyến mãi, và các hoạt động gian lận và lạm dụng khác.</p>

<h3>6. Thông Tin Cá Nhân Chính Xác Và Hợp Pháp</h3>
<p>Chúng tôi yêu cầu Đối tác tài xế cung cấp chính xác các thông tin như họ và tên, ảnh đại diện, kiểu xe, biển số xe và màu xe (với dòng xe ô tô) để hành khách có thể nhận diện tài xế và xe của họ. Bên cạnh đó, chúng tôi sẽ kiểm tra hồ sơ xe và lý lịch, để đảm bảo tính an toàn và tuân thủ các tiêu chí của chúng tôi.</p>
<p><strong>Nguyên nhân khiến tài khoản Đối tác tài xế/Hành khách của bạn bị khóa tạm thời hay bị ngừng hợp tác/cung cấp dịch vụ vĩnh viễn?</strong></p>
<p>Chúng tôi có thể ngừng hợp tác với bạn vĩnh viễn nếu phát hiện vi phạm tiêu chuẩn an toàn của Lifestyle hay tiêu chí khác theo yêu cầu của cơ quan quản lý khi kiểm tra hồ sơ xe hoặc lý lịch định kỳ; cung cấp cho Lifestyle thông tin không chính xác; cho phép người khác sử dụng tài khoản của bạn; thực hiện chuyến đi bằng xe chưa được phê duyệt và các hành vi vi phạm khác. Tài khoản của bạn cũng sẽ bị tạm khóa nếu giấy tờ bắt buộc của bạn trở nên không hợp lệ như giấy phép lái xe hết hạn, cho đến khi bạn cung cấp cho Lifestyle thông tin cập nhật.</p>

<h3>7. Bảo Mật Thông Tin</h3>
<p>Để đảm bảo an toàn và bảo mật những thông tin cá nhân, Đối tác tài xế/Hành khách tránh liên hệ không cần thiết với nhau như nhắn tin, gọi điện hoặc tìm gặp trực tiếp sau khi chuyến đi kết thúc. Ngoài ra, cần tránh chia sẻ những thông tin riêng tư của Đối tác tài xế/Hành khách như số điện thoại, hình ảnh cá nhân sau khi kết thúc chuyến đi lên các diễn đàn, mạng xã hội và các hoạt động tương tự.</p>

<h3>8. Phân Biệt Đối Xử</h3>
<p>Lifestyle là ứng dụng kết nối hành khách với phương tiện vận chuyển đáng tin cậy cho tất cả mọi người. Chính vì vậy, Lifestyle sẽ không khoan nhượng cho bất cứ hành động hay ngôn ngữ mang tính phân biệt đối xử.</p>
<p><strong>Nguyên nhân khiến tài khoản Đối tác tài xế/hành khách của bạn bị khóa tạm thời hay bị ngừng hợp tác/cung cấp dịch vụ vĩnh viễn?</strong></p>
<p>Những hành động phân biệt đối xử dựa trên đặc điểm chủng tộc, tôn giáo, dân tộc, tình trạng khuyết tật, khuynh hướng tính dục, giới tính, tình trạng hôn nhân, tuổi tác hay bất kỳ đặc điểm cá nhân nào khác có thể vi phạm pháp luật hiện hành. Việc này sẽ khiến tài khoản của bạn bị xem xét khóa tạm thời hoặc bị ngừng hợp tác/cung cấp dịch vụ vĩnh viễn.</p>

<h3>9. Trở Lại Lái Xe Sau Khi Bị Hủy Kích Hoạt</h3>
<p>Nếu tài khoản Đối tác tài xế của bạn bị hủy kích hoạt vì lý do chất lượng như xếp hạng sao thấp, bạn có thể có cơ hội trở lại lái xe nếu thực hiện các bước cải thiện đáp ứng yêu cầu của Lifestyle và được kiểm tra bởi đội ngũ Lifestyle. Trong trường hợp tài khoản Đối tác tài xế của bạn bị hủy kích hoạt vĩnh viễn, bạn không được phép đăng ký tài khoản Đối tác tài xế thay thế với Lifestyle.</p>

<hr />

<h3>An toàn</h3>
<p>Hãy đảm bảo rằng bạn luôn tuân thủ nghiêm chỉnh luật lệ giao thông Việt Nam. Khi di chuyển bằng xe ô tô, hãy luôn nhớ thắt dây an toàn dù bạn ngồi ghế trước hay ghế sau. Khi di chuyển bằng xe máy, hãy luôn đội nón bảo hiểm khi ngồi trên xe. Đối tác tài xế có trách nhiệm cụ thể về vấn đề an toàn và tuyệt đối không thực hiện các hành vi cấm theo Điều Luật Giao Thông Đường Bộ trong các chuyến xe Lifestyle như: không điều khiển phương tiện giao thông đường bộ mà trong cơ thể có chất ma túy, trong máu hoặc hơi thở có nồng độ cồn; không chạy quá tốc độ cho phép, lạng lách, đánh võng; không đe dọa, xúc phạm, tranh giành, lôi kéo hành khách; không bắt ép hành khách sử dụng dịch vụ ngoài ý muốn; không sử dụng điện thoại khi đang chạy xe (đối tác có thể dùng giá đỡ điện thoại để xem chỉ đường hay tai nghe bluetooth để nghe điện thoại). Các đối tác tài xế không nên nhận chuyến trong tình trạng mệt mỏi và buồn ngủ. Hãy đảm bảo tình trạng sức khỏe tốt khi đang lái xe để đảm bảo an toàn tối đa.</p>

<h3>Tôn trọng</h3>
<p>Trong cộng đồng Lifestyle, dù bạn là đối tác tài xế hay hành khách, bạn hãy thể hiện sự tôn trọng lẫn nhau. Với hành khách đi xe, vui lòng không hét lớn, chửi thề hay đóng cửa xe mạnh tay nhằm đảm bảo những phép lịch sự tối thiểu. Để xe luôn sạch sẽ và giúp cho hành khách tiếp theo cũng có được một chuyến đi thoải mái, hãy giữ vệ sinh chung bằng cách: cầm theo rác của mình ra khỏi xe và lau sạch đồ uống bị đổ ra xe; tránh đem đồ ăn, thức uống có mùi khó chịu lên xe; luôn kiểm tra lại hành lý, vật dụng cá nhân trước khi rời khỏi xe. Khi sử dụng dịch vụ của Lifestyle, bạn sẽ gặp những người có phong cách hoặc suy nghĩ, giọng nói hoàn toàn khác với bạn. Hãy tôn trọng sự khác biệt đối với cả người Việt Nam lẫn người nước ngoài.</p>
<p>Chúng ta cũng nên tôn trọng không gian và quyền riêng tư của nhau. Với hành khách đi xe, khi đang ngồi trên xe và bạn cần nói chuyện điện thoại hoặc khi bạn trò chuyện với những người đi cùng, hãy nói nhỏ tiếng để tránh làm phiền tài xế đang tập trung chạy xe. Một điều quan trọng tại Lifestyle: trong mọi trường hợp, không được phép có bất cứ hành vi quấy rối nào giữa đối tác tài xế và hành khách trên xe dù là tán tỉnh hay có đụng chạm.</p>

<h3>Trẻ em</h3>
<p>Người từ đủ 18 tuổi trở lên có thể đăng ký mở tài khoản hành khách và chịu trách nhiệm hoàn toàn về tài khoản này.</p>
<p>Người từ đủ 15 tuổi đến chưa đủ 18 tuổi có thể đăng ký mở tài khoản hành khách và chịu trách nhiệm về tài khoản này. Tuy nhiên, khi có phát sinh vấn đề như bồi thường thiệt hại thì cha, mẹ hoặc người giám hộ của hành khách sẽ chịu trách nhiệm.</p>
<p>Người từ đủ 6 tuổi đến chưa đủ 15 tuổi phải được sự đồng ý và được theo sát bởi cha, mẹ hoặc người giám hộ khi sử dụng tài khoản hành khách.</p>
<p>Đối với trẻ em chưa đủ 6 tuổi thì trong mọi trường hợp, Lifestyle chỉ chấp nhận cung cấp dịch vụ khi đi cùng người đã thành niên.</p>

<h3>Động vật cảnh</h3>
<p>Động vật cảnh có thể được đối tác tài xế của Lifestyle chấp nhận chuyên chở bao gồm: chó, mèo, chim cảnh, cá cảnh. Các động vật khác không được coi là động vật cảnh và bị từ chối chuyên chở (trừ một số trường hợp cụ thể hoặc động vật khác được đối tác tài xế của Lifestyle chấp thuận).</p>
<p>Hành khách có thể mang động vật cảnh hoặc động vật khác (đã được đề cập trên) có kích thước phù hợp lên xe và cần thông báo trước điều này đến đối tác tài xế khi họ nhận chuyến. Tuy nhiên, hành khách phải đảm bảo các vấn đề vệ sinh, an toàn tuyệt đối cho cả đối tác tài xế, hành khách đi cùng và vật nuôi. Trong trường hợp vật nuôi có kích thước không phù hợp hoặc hành khách không đảm bảo an toàn, không đảm bảo vệ sinh hay đối tác tài xế bị dị ứng với lông động vật thì đối tác tài xế có quyền từ chối chuyến đi này.</p>
<p>Nếu động vật cảnh làm mất vệ sinh hoặc/và làm ảnh hưởng đến sự an toàn của đối tác tài xế (cào, cắn, mổ… hoặc các hành vi đe dọa khác) thì hành khách sẽ phải chịu trách nhiệm bồi thường (nếu có).</p>

<h3>Phản hồi</h3>
<p>Hãy xếp hạng và gửi phản hồi về chuyến đi sau khi kết thúc hành trình một cách khách quan để góp phần cải thiện chất lượng dịch vụ, cũng như giúp Lifestyle trở thành một môi trường thật an toàn và chuyên nghiệp. Nếu có bất cứ vấn đề nào, hãy liên hệ và gửi thông tin cho Lifestyle qua mục "Hỗ Trợ" trong ứng dụng, hoặc liên hệ hotline: <strong>082 6600 800</strong>.</p>

<h3>Đồng phục</h3>
<p>Màu vàng là màu thể hiện cho sự an toàn và đã được khoa học chứng minh rằng sẽ giúp giảm nguy cơ gây tai nạn giao thông đến 50%. Lifestyle đã đầu tư rất nghiêm túc về đồng phục cho Đối tác tài xế nhằm đem đến sự thoải mái, thuận tiện và an toàn. Việc khoác lên mình bộ đồng phục của Lifestyle vừa để hành khách dễ dàng nhận diện, vừa đảm bảo tính chuyên nghiệp và sự nhất quán về hình ảnh Đối tác tài xế của Lifestyle. Chính vì những điều đó, việc mặc đồng phục khi thực hiện các chuyến đi của Lifestyle đối với các Đối tác tài xế LifestyleBike là bắt buộc. Nếu Đối tác tài xế vẫn tiếp tục vi phạm về quy định mặc đồng phục sau nhiều lần nhắc nhở, Lifestyle sẽ xem xét về việc ngừng hợp tác vĩnh viễn.</p>`,
    targetApps: 'USER,DRIVER',
  },
];

async function main(): Promise<void> {
  const now = new Date();
  const forceUpdate = process.argv.includes('--update');

  for (const doc of DEFAULT_DOCS) {
    const existing = await prisma.legal_documents.findFirst({
      where: { slug: doc.slug, locale: doc.locale },
      orderBy: { effectiveFrom: 'desc' },
    });

    if (existing) {
      if (forceUpdate) {
        await prisma.legal_documents.update({
          where: { id: existing.id },
          data: {
            title: doc.title,
            content: doc.content,
            targetApps: (doc as { targetApps?: string }).targetApps ?? 'ALL',
            updatedAt: now,
          },
        });
        console.log(`[OK] Đã cập nhật: ${doc.slug} (${doc.locale})`);
      } else {
        console.log(`[OK] Văn bản đã tồn tại: ${doc.slug} (${doc.locale}). Dùng --update để ghi đè.`);
      }
      continue;
    }

    await prisma.legal_documents.create({
      data: {
        slug: doc.slug,
        locale: doc.locale,
        title: doc.title,
        content: doc.content,
        version: 1,
        effectiveFrom: now,
        effectiveTo: null,
        isActive: true,
        targetApps: (doc as { targetApps?: string }).targetApps ?? 'ALL',
      },
    });

    console.log(`[OK] Đã tạo: ${doc.slug} (${doc.locale})`);
  }
}

main()
  .catch((e) => {
    console.error('[ERROR]', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
